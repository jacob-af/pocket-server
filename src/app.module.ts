import { Module } from '@nestjs/common';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DateTimeResolver, EmailAddressResolver } from 'graphql-scalars';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { IngredientModule } from './ingredient/ingredient.module';
import { BuildModule } from './build/build.module';
import { TouchModule } from './touch/touch.module';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      playground: false,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      resolvers: {
        Date: DateTimeResolver,
        Email: EmailAddressResolver,
      },
    }),
    AuthModule,
    UserModule,
    IngredientModule,
    BuildModule,
    TouchModule,
    RecipeModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AppModule {}
