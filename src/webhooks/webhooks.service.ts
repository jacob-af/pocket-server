import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class WebhooksService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService, // Inject the service here
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  async upsertSubscription(event: Stripe.CheckoutSessionCompletedEvent) {
    const s = event.data.object;
    const user = await this.prisma.user.findUnique({
      where: { email: s.customer_email },
    });
    if (!user) {
      throw new Error('There is no user with that email address');
    }
    const sub = await this.getSubscription(s.subscription as string);
    console.log(sub);
    await this.prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        stripeId: s.customer as string,
        status: s.payment_status as string,
        subscriptionId: sub.id as string,
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        updatedAt: new Date(),
      },
      create: {
        stripeId: s.customer as string,
        user: { connect: { id: user.id } },
        status: s.payment_status as string,
        subscriptionId: s.subscription as string,
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
      },
    });
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async deleteSubscription(event: Stripe.CustomerSubscriptionDeletedEvent) {
    console.log(event.data.object);
    await this.prisma.subscription.update({
      where: { stripeId: event.data.object.customer as string },
      data: {
        status: 'free',
        currentPeriodEnd: new Date(),
      },
    });
  }
}
