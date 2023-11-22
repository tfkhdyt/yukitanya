ALTER TABLE "answer" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "answer" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET NOT NULL;