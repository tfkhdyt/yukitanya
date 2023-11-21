ALTER TABLE "rating" DROP CONSTRAINT "rating_answer_id_answer_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rating" ADD CONSTRAINT "rating_answer_id_answer_id_fk" FOREIGN KEY ("answer_id") REFERENCES "answer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
