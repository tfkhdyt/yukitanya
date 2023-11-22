ALTER TABLE "favorite" RENAME COLUMN "answer_id" TO "question_id";--> statement-breakpoint
ALTER TABLE "favorite" DROP CONSTRAINT "favorite_answer_id_user_id";--> statement-breakpoint
ALTER TABLE "favorite" DROP CONSTRAINT "favorite_answer_id_answer_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorite" ADD CONSTRAINT "favorite_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
