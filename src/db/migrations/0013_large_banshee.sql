CREATE TABLE "leavenotification" (
	"id" serial PRIMARY KEY NOT NULL,
	"notification" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
