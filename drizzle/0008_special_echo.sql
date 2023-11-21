ALTER TABLE "questions_to_subjects" RENAME TO "question_to_subject";--> statement-breakpoint
ALTER TABLE "question_to_subject" DROP CONSTRAINT "questions_to_subjects_question_id_question_id_fk";
--> statement-breakpoint
ALTER TABLE "question_to_subject" DROP CONSTRAINT "questions_to_subjects_subject_id_subject_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_to_subject" ADD CONSTRAINT "question_to_subject_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_to_subject" ADD CONSTRAINT "question_to_subject_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
