-- CreateTable
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "admin_api_key_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

CREATE TABLE IF NOT EXISTS "licenses" (
    "id" SERIAL NOT NULL,
    "license_key" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "plan" TEXT,
    "customer_name" TEXT,
    "customer_email" TEXT,
    "max_activations" INTEGER NOT NULL DEFAULT 1,
    "activation_policy" TEXT NOT NULL DEFAULT 'block_new',
    "allowed_domains" JSONB,
    "meta" JSONB,
    "expires_at" TIMESTAMP(3),
    "last_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "licenses_license_key_key" ON "licenses"("license_key");
CREATE UNIQUE INDEX IF NOT EXISTS "licenses_key_hash_key" ON "licenses"("key_hash");

CREATE TABLE IF NOT EXISTS "license_activations" (
    "id" SERIAL NOT NULL,
    "license_id" INTEGER NOT NULL,
    "device_fingerprint" TEXT NOT NULL,
    "app_url" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "environment_bucket" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "license_activations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "license_activations_license_id_device_fingerprint_environment_bucket_key" ON "license_activations"("license_id", "device_fingerprint", "environment_bucket");

CREATE TABLE IF NOT EXISTS "license_device_blocks" (
    "id" SERIAL NOT NULL,
    "license_id" INTEGER NOT NULL,
    "device_fingerprint" TEXT NOT NULL,
    "environment_bucket" TEXT NOT NULL,
    "reason" TEXT,
    "blocked_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "license_device_blocks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "license_device_blocks_license_id_device_fingerprint_environment_bucket_key" ON "license_device_blocks"("license_id", "device_fingerprint", "environment_bucket");

CREATE TABLE IF NOT EXISTS "license_generation_logs" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "license_id" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "license_generation_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "license_server_audit_logs" (
    "id" SERIAL NOT NULL,
    "actor_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "license_server_audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "server_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "server_settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "server_settings_key_key" ON "server_settings"("key");

CREATE TABLE IF NOT EXISTS "used_nonces" (
    "id" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "used_nonces_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "used_nonces_nonce_scope_key" ON "used_nonces"("nonce", "scope");

ALTER TABLE "license_activations" ADD CONSTRAINT "license_activations_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "licenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "license_device_blocks" ADD CONSTRAINT "license_device_blocks_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "licenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "license_device_blocks" ADD CONSTRAINT "license_device_blocks_blocked_by_user_id_fkey" FOREIGN KEY ("blocked_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "license_generation_logs" ADD CONSTRAINT "license_generation_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "license_generation_logs" ADD CONSTRAINT "license_generation_logs_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "licenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "license_server_audit_logs" ADD CONSTRAINT "license_server_audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
