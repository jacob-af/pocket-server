import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  async upsertSubscription(session: Stripe.CheckoutSessionCompletedEvent) {
    console.log(session.data.object);
    const s = session.data.object;
    const user = await this.prisma.user.findUnique({
      where: { email: s.customer_email },
    });
    if (!user) {
      throw new Error('There is no user with that email address');
    }
    await this.prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        status: s.payment_status as string,
        currentPeriodStart: new Date(s.created * 1000),
        currentPeriodEnd: new Date(s.expires_at * 1000),
        updatedAt: new Date(),
      },
      create: {
        stripeId: s.customer as string,
        user: { connect: { id: user.id } },
        status: s.payment_status as string,
        currentPeriodStart: new Date(s.created * 1000),
        currentPeriodEnd: new Date(s.expires_at * 1000),
      },
    });
  }
}
