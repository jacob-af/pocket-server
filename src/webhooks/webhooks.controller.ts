import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhooksService } from './webhooks.service'; // Import your Webhooks service
import Stripe from 'stripe';
import { Public } from 'src/auth/decorators/public-decorators';

@Controller('webhooks')
export class WebhooksController {
  private stripe: Stripe;

  constructor(
    private webhooksService: WebhooksService, // Inject the service here
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  @Get('/')
  async index(): Promise<string> {
    return 'ok';
  }

  @Public()
  @Post('stripe')
  async handleStripeWebhook(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const sig = request.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.webhooksService.upsertSubscription(event);
        break;
      case 'customer.subscription.deleted':
        await this.webhooksService.deleteSubscription(event);
        break;

      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.send();
  }
}
