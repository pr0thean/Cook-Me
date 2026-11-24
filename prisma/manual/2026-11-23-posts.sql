-- Phase 2 (community posts): rename `comments` → `posts`, add `post_images` and the `post-images` bucket.
--
-- Afterwards `npm run db:push` should report that the database is already in sync.

BEGIN;

-- comments → posts (a rename keeps any existing rows, the RLS setting and the id sequence)
ALTER TABLE "comments" RENAME TO "posts";
ALTER SEQUENCE "comments_id_seq" RENAME TO "posts_id_seq";
ALTER TABLE "posts" RENAME CONSTRAINT "comments_pkey" TO "posts_pkey";
ALTER TABLE "posts" RENAME CONSTRAINT "comments_recipe_id_fkey" TO "posts_recipe_id_fkey";
ALTER TABLE "posts" RENAME CONSTRAINT "comments_user_id_fkey" TO "posts_user_id_fkey";

ALTER TABLE "posts"
  ALTER COLUMN "content" DROP NOT NULL,
  DROP COLUMN "imageUrl",
  ADD COLUMN "hidden" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "edited_at" TIMESTAMPTZ(6);

CREATE INDEX "posts_recipe_id_created_at_idx" ON "posts"("recipe_id", "created_at");
CREATE INDEX "posts_user_id_created_at_idx" ON "posts"("user_id", "created_at");
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at");

-- post_images
CREATE TABLE "post_images" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,

    CONSTRAINT "post_images_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "post_images_recipe_id_created_at_idx" ON "post_images"("recipe_id", "created_at");
CREATE INDEX "post_images_created_at_idx" ON "post_images"("created_at");
CREATE UNIQUE INDEX "post_images_post_id_position_key" ON "post_images"("post_id", "position");

ALTER TABLE "post_images" ADD CONSTRAINT "post_images_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "post_images" ADD CONSTRAINT "post_images_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Same as every other table: RLS on, no policies (the Data API returns nothing; Prisma bypasses RLS)
ALTER TABLE "post_images" ENABLE ROW LEVEL SECURITY;

-- Public bucket: files are readable through their public URL. No storage policies are added, so only
-- the service-role client (server code) can write. Limits mirror the server-side validation.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('post-images', 'post-images', true, 1048576, ARRAY['image/webp', 'image/jpeg']);

COMMIT;
