CREATE TYPE "public"."user_role" AS ENUM('CLIENT', 'ADVISOR', 'DIRECTOR');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('PENDING_CONFIRMATION', 'ACTIVE', 'BANNED');--> statement-breakpoint
CREATE TYPE "public"."account_type" AS ENUM('CHECKING', 'SAVINGS');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('PENDING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('TRANSFER', 'INTEREST', 'LOAN_DISBURSEMENT', 'LOAN_PAYMENT', 'STOCK_PURCHASE', 'STOCK_SALE');--> statement-breakpoint
CREATE TYPE "public"."stock_status" AS ENUM('AVAILABLE', 'UNAVAILABLE');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('PENDING', 'PARTIALLY_FILLED', 'FILLED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."order_type" AS ENUM('BUY', 'SELL');--> statement-breakpoint
CREATE TYPE "public"."loan_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'DEFAULTED');--> statement-breakpoint
CREATE TYPE "public"."conversation_status" AS ENUM('WAITING', 'OPEN', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('ACCOUNT_CREATED', 'TRANSACTION_RECEIVED', 'LOAN_APPROVED', 'LOAN_REJECTED', 'SAVINGS_RATE_UPDATED', 'MESSAGE_RECEIVED');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"role" "user_role" DEFAULT 'CLIENT' NOT NULL,
	"status" "user_status" DEFAULT 'PENDING_CONFIRMATION' NOT NULL,
	"confirmation_token" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"iban" varchar(34) NOT NULL,
	"custom_name" varchar(100) NOT NULL,
	"type" "account_type" NOT NULL,
	"balance" numeric(15, 2) DEFAULT '0' NOT NULL,
	"savings_rate" numeric(5, 4),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_iban_unique" UNIQUE("iban")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_account_id" uuid NOT NULL,
	"to_account_id" uuid NOT NULL,
	"type" "transaction_type" NOT NULL,
	"status" "transaction_status" DEFAULT 'PENDING' NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"current_price" numeric(15, 2) NOT NULL,
	"status" "stock_status" DEFAULT 'AVAILABLE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stocks_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stock_id" uuid NOT NULL,
	"type" "order_type" NOT NULL,
	"quantity" integer NOT NULL,
	"price_per_share" numeric(15, 2) NOT NULL,
	"remaining_quantity" integer NOT NULL,
	"fees" numeric(15, 2) DEFAULT '0' NOT NULL,
	"status" "order_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "portfolios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stock_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"average_purchase_price" numeric(15, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"advisor_id" uuid,
	"amount" numeric(15, 2) NOT NULL,
	"interest_rate" numeric(5, 4) NOT NULL,
	"duration_months" integer NOT NULL,
	"monthly_payment" numeric(15, 2) NOT NULL,
	"remaining_balance" numeric(15, 2) NOT NULL,
	"status" "loan_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"advisor_id" uuid,
	"subject" varchar(255) NOT NULL,
	"status" "conversation_status" DEFAULT 'WAITING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"savings_rate" numeric(5, 4) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_from_account_id_accounts_id_fk" FOREIGN KEY ("from_account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_to_account_id_accounts_id_fk" FOREIGN KEY ("to_account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stocks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stocks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loans" ADD CONSTRAINT "loans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loans" ADD CONSTRAINT "loans_advisor_id_users_id_fk" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversations" ADD CONSTRAINT "conversations_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversations" ADD CONSTRAINT "conversations_advisor_id_users_id_fk" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
