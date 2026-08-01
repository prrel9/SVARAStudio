-- Send INSERT, UPDATE, and DELETE events from public.studios to Supabase Realtime.
-- The conditional keeps this migration safe to run when the table was enabled earlier.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_rel publication_relation
    JOIN pg_publication publication ON publication.oid = publication_relation.prpubid
    JOIN pg_class relation ON relation.oid = publication_relation.prrelid
    JOIN pg_namespace schema ON schema.oid = relation.relnamespace
    WHERE publication.pubname = 'supabase_realtime'
      AND schema.nspname = 'public'
      AND relation.relname = 'studios'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.studios;
  END IF;
END;
$$;
