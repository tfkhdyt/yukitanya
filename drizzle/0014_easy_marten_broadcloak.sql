CREATE TABLE IF NOT EXISTS "favorite" (
	"answer_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT favorite_answer_id_user_id PRIMARY KEY("answer_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorite" ADD CONSTRAINT "favorite_answer_id_answer_id_fk" FOREIGN KEY ("answer_id") REFERENCES "answer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
