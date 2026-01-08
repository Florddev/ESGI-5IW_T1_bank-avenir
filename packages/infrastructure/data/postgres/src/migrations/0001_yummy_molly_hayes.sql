ALTER TABLE "transactions" DROP CONSTRAINT "transactions_from_account_id_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_to_account_id_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "loans" DROP CONSTRAINT "loans_advisor_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "from_account_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "to_account_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "advisor_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "account_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "principal" numeric(15, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "remaining_principal" numeric(15, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "annual_interest_rate" numeric(5, 4) NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "insurance_rate" numeric(5, 4) NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "remaining_months" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "next_payment_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loans" ADD CONSTRAINT "loans_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loans" ADD CONSTRAINT "loans_advisor_id_users_id_fk" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN IF EXISTS "amount";--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN IF EXISTS "interest_rate";--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN IF EXISTS "remaining_balance";--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN IF EXISTS "approved_at";--> statement-breakpoint
ALTER TABLE "public"."loans" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."loan_status";--> statement-breakpoint
CREATE TYPE "public"."loan_status" AS ENUM('ACTIVE', 'COMPLETED', 'DEFAULTED');--> statement-breakpoint
ALTER TABLE "public"."loans" ALTER COLUMN "status" SET DATA TYPE "public"."loan_status" USING "status"::"public"."loan_status";--> statement-breakpoint
ALTER TABLE "public"."notifications" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."notification_type";--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('SAVINGS_RATE_CHANGE', 'TRANSACTION', 'LOAN_PAYMENT_DUE', 'ORDER_FILLED', 'MESSAGE_RECEIVED');--> statement-breakpoint
ALTER TABLE "public"."notifications" ALTER COLUMN "type" SET DATA TYPE "public"."notification_type" USING "type"::"public"."notification_type";