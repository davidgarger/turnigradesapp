-- Enable RLS on realtime.messages and restrict channel subscriptions to the user's own topic
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their own app_state channel" ON realtime.messages;

CREATE POLICY "Users can only access their own app_state channel"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() = 'app_state:' || auth.uid()::text
);