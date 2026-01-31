ALTER TABLE "conversations" ALTER COLUMN "client_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "is_group_chat" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "type";--> statement-breakpoint
DROP TYPE "public"."conversation_type";