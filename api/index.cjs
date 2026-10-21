"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/app.ts
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);

// server/auth.ts
var import_express_session = __toESM(require("express-session"), 1);
var import_connect_pg_simple = __toESM(require("connect-pg-simple"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

// server/db/schema.ts
function nowIso() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function createId(prefix) {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${rand}`;
}
function slugify(value) {
  return value.toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}

// server/db/client.ts
var import_postgres = __toESM(require("postgres"), 1);
if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not set");
}
var dbUrl = new URL(process.env.POSTGRES_URL);
console.log("Database connection:", {
  host: dbUrl.hostname,
  database: dbUrl.pathname.slice(1)
});
var sql = (0, import_postgres.default)(process.env.POSTGRES_URL, {
  ssl: "require"
});

// server/storage.ts
var storage = {
  async getUsers() {
    const rows = await sql`
      select
        id,
        email,
        full_name as "fullName",
        avatar_url as "avatarUrl",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from users
      order by created_at desc
    `;
    return rows;
  },
  async getUserById(userId) {
    const rows = await sql`
      select
        id,
        email,
        full_name as "fullName",
        avatar_url as "avatarUrl",
        bio,
        phone,
        created_at as "createdAt",
        updated_at as "updatedAt"
      from users
      where id = ${userId}
      limit 1
    `;
    return rows[0] ?? null;
  },
  // async getUserByEmail(email: string): Promise<UserRecord | null> {
  //   const rows = await sql<UserRecord[]>`
  //     select
  //       id,
  //       email,
  //       full_name as "fullName",
  //       avatar_url as "avatarUrl",
  //       created_at as "createdAt",
  //       updated_at as "updatedAt"
  //     from users
  //     where lower(email) = lower(${email})
  //     limit 1
  //   `;
  //   return rows[0] ?? null;
  // },
  // async createUser(user: UserRecord): Promise<UserRecord> {
  //   await sql`
  //     insert into users (
  //       id,
  //       email,
  //       full_name,
  //       avatar_url,
  //       created_at,
  //       updated_at
  //     ) values (
  //       ${user.id},
  //       ${user.email},
  //       ${user.fullName},
  //       ${user.avatarUrl ?? null},
  //       ${user.createdAt},
  //       ${user.updatedAt}
  //     )
  //   `;
  //   return user;
  // },
  async updateUser(userId, updates) {
    const existing = await this.getUserById(userId);
    if (!existing) return null;
    const next = {
      ...existing,
      ...updates
    };
    await sql`
      update users
      set
        email = ${next.email},
        full_name = ${next.fullName},
        avatar_url = ${next.avatarUrl ?? null},
        bio = ${next.bio ?? null},
        phone = ${next.phone ?? null},
        updated_at = ${next.updatedAt}
      where id = ${userId}
    `;
    return next;
  },
  async createMakerspace(makerspace) {
    await sql`
      insert into makerspaces (
        id,
        name,
        slug,
        location,
        description,
        website,
        logo_url,
        created_by_user_id,
        created_at,
        updated_at
      ) values (
        ${makerspace.id},
        ${makerspace.name},
        ${makerspace.slug},
        ${makerspace.location},
        ${makerspace.description},
        ${makerspace.website ?? null},
        ${makerspace.logoUrl ?? null},
        ${makerspace.createdByUserId},
        ${makerspace.createdAt},
        ${makerspace.updatedAt}
      )
    `;
    return makerspace;
  },
  async getMakerspaceById(makerspaceId) {
    const rows = await sql`
      select
        id,
        name,
        slug,
        location,
        description,
        website,
        logo_url as "logoUrl",
        onboarding_completed as "onboardingCompleted",
      onboarding_completed_at as "onboardingCompletedAt",
        created_by_user_id as "createdByUserId",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from makerspaces
      where id = ${makerspaceId}
      limit 1
    `;
    return rows[0] ?? null;
  },
  async getMakerspaceBySlug(slug) {
    const rows = await sql`
      select
        id,
        name,
        slug,
        location,
        description,
        website,
        logo_url as "logoUrl",
        onboarding_completed as "onboardingCompleted",
      onboarding_completed_at as "onboardingCompletedAt",
        created_by_user_id as "createdByUserId",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from makerspaces
      where slug = ${slug}
      limit 1
    `;
    return rows[0] ?? null;
  },
  async getMakerspaceByCreatedByUserId(userId) {
    const rows = await sql`
      select
        id,
        name,
        slug,
        location,
        description,
        website,
        logo_url as "logoUrl",
        onboarding_completed as "onboardingCompleted",
      onboarding_completed_at as "onboardingCompletedAt",
        created_by_user_id as "createdByUserId",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from makerspaces
      where created_by_user_id = ${userId}
      limit 1
    `;
    return rows[0] ?? null;
  },
  async listMakerspaces() {
    const rows = await sql`
      select
        id,
        name,
        slug,
        location,
        description,
        website,
        logo_url as "logoUrl",
        onboarding_completed as "onboardingCompleted",
      onboarding_completed_at as "onboardingCompletedAt",
        created_by_user_id as "createdByUserId",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from makerspaces
      order by created_at desc
    `;
    return rows;
  },
  async updateMakerspace(makerspaceId, updates) {
    const existing = await this.getMakerspaceById(makerspaceId);
    if (!existing) return null;
    const next = {
      ...existing,
      ...updates
    };
    await sql`
      update makerspaces
      set
        name = ${next.name},
        slug = ${next.slug},
        location = ${next.location},
        description = ${next.description},
        website = ${next.website ?? null},
        logo_url = ${next.logoUrl ?? null},
        updated_at = ${next.updatedAt}
      where id = ${makerspaceId}
    `;
    return next;
  },
  async createMembership(membership) {
    const existing = await this.getMembershipByMakerspaceAndUser(
      membership.makerspaceId,
      membership.userId
    );
    if (existing) return existing;
    await sql`
      insert into memberships (
        id,
        makerspace_id,
        user_id,
        role,
        status,
        joined_at,
        created_at
      ) values (
        ${membership.id},
        ${membership.makerspaceId},
        ${membership.userId},
        ${membership.role},
        ${membership.status},
        ${membership.joinedAt ?? null},
        ${membership.createdAt}
      )
    `;
    return membership;
  },
  async getMembershipById(membershipId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        role,
        status,
        joined_at as "joinedAt",
        created_at as "createdAt"
      from memberships
      where id = ${membershipId}
      limit 1
    `;
    return rows[0] ?? null;
  },
  async getMembershipByMakerspaceAndUser(makerspaceId, userId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        role,
        status,
        joined_at as "joinedAt",
        created_at as "createdAt"
      from memberships
      where makerspace_id = ${makerspaceId}
        and user_id = ${userId}
      limit 1
    `;
    return rows[0] ?? null;
  },
  async getMembershipsByMakerspaceId(makerspaceId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        role,
        status,
        joined_at as "joinedAt",
        created_at as "createdAt"
      from memberships
      where makerspace_id = ${makerspaceId}
      order by created_at asc
    `;
    return rows;
  },
  async getMembershipsByUserId(userId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        role,
        status,
        joined_at as "joinedAt",
        created_at as "createdAt"
      from memberships
      where user_id = ${userId}
      order by created_at asc
    `;
    return rows;
  },
  async updateMembership(membershipId, updates) {
    const existing = await this.getMembershipById(membershipId);
    if (!existing) return null;
    const next = {
      ...existing,
      ...updates
    };
    await sql`
      update memberships
      set
        role = ${next.role},
        status = ${next.status},
        joined_at = ${next.joinedAt ?? null}
      where id = ${membershipId}
    `;
    return next;
  },
  async createInvite(invite) {
    await sql`
      insert into invites (
        id,
        makerspace_id,
        email,
        token,
        invited_by_user_id,
        role,
        status,
        expires_at,
        created_at
      ) values (
        ${invite.id},
        ${invite.makerspaceId},
        ${invite.email ?? null},
        ${invite.token},
        ${invite.invitedByUserId},
        ${invite.role},
        ${invite.status},
        ${invite.expiresAt ?? null},
        ${invite.createdAt}
      )
    `;
    return invite;
  },
  async getInviteByToken(token) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        email,
        token,
        invited_by_user_id as "invitedByUserId",
        role,
        status,
        expires_at as "expiresAt",
        created_at as "createdAt"
      from invites
      where token = ${token}
      limit 1
    `;
    return rows[0] ?? null;
  },
  async getInvitesByMakerspaceId(makerspaceId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        email,
        token,
        invited_by_user_id as "invitedByUserId",
        role,
        status,
        expires_at as "expiresAt",
        created_at as "createdAt"
      from invites
      where makerspace_id = ${makerspaceId}
      order by created_at desc
    `;
    return rows;
  },
  async updateInvite(inviteId, updates) {
    const existing = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        email,
        token,
        invited_by_user_id as "invitedByUserId",
        role,
        status,
        expires_at as "expiresAt",
        created_at as "createdAt"
      from invites
      where id = ${inviteId}
      limit 1
    `;
    const row = existing[0];
    if (!row) return null;
    const next = { ...row, ...updates };
    await sql`
      update invites
      set
        email = ${next.email ?? null},
        role = ${next.role},
        status = ${next.status},
        expires_at = ${next.expiresAt ?? null}
      where id = ${inviteId}
    `;
    return next;
  },
  async createMachine(machine) {
    await sql`
      insert into machines (
        id,
        makerspace_id,
        name,
        slug,
        type,
        brand,
        model,
        location_label,
        description,
        image_url,
        requires_certification,
        status,
        catalog_source_id,
        created_at,
        updated_at
      ) values (
        ${machine.id},
        ${machine.makerspaceId},
        ${machine.name},
        ${machine.slug},
        ${machine.type},
        ${machine.brand ?? null},
        ${machine.model ?? null},
        ${machine.locationLabel},
        ${machine.description},
        ${machine.imageUrl ?? null},
        ${machine.requiresCertification},
        ${machine.status},
        ${machine.catalogSourceId ?? null},
        ${machine.createdAt},
        ${machine.updatedAt}
      )
    `;
    return machine;
  },
  async getMachineById(machineId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        name,
        slug,
        type,
        brand,
        model,
        location_label as "locationLabel",
        description,
        image_url as "imageUrl",
        requires_certification as "requiresCertification",
        status,
        catalog_source_id as "catalogSourceId",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from machines
      where id = ${machineId}
      limit 1
    `;
    return rows[0] ?? null;
  },
  async getMachinesByMakerspaceId(makerspaceId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        name,
        slug,
        type,
        brand,
        model,
        location_label as "locationLabel",
        description,
        image_url as "imageUrl",
        requires_certification as "requiresCertification",
        status,
        catalog_source_id as "catalogSourceId",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from machines
      where makerspace_id = ${makerspaceId}
      order by created_at desc
    `;
    return rows;
  },
  async updateMachine(machineId, updates) {
    const existing = await this.getMachineById(machineId);
    if (!existing) return null;
    const next = {
      ...existing,
      ...updates
    };
    await sql`
      update machines
      set
        name = ${next.name},
        type = ${next.type},
        brand = ${next.brand ?? null},
        model = ${next.model ?? null},
        location_label = ${next.locationLabel},
        description = ${next.description},
        image_url = ${next.imageUrl ?? null},
        requires_certification = ${next.requiresCertification},
        status = ${next.status},
        catalog_source_id = ${next.catalogSourceId ?? null},
        updated_at = ${next.updatedAt}
      where id = ${machineId}
    `;
    return next;
  },
  async deleteMachine(machineId) {
    const result = await sql`
      delete from machines
      where id = ${machineId}
    `;
    return result.count > 0;
  },
  async createCertificationModule(module2) {
    await sql`
      insert into certification_modules (
        id,
        makerspace_id,
        machine_id,
        title,
        description,
        version,
        source_type,
        source_template_id,
        status,
        content_json,
        estimated_minutes,
        passing_score,
        expires_in_days,
        is_required,
        is_published,
        created_at,
        updated_at
      ) values (
        ${module2.id},
        ${module2.makerspaceId},
        ${module2.machineId ?? null},
        ${module2.title},
        ${module2.description ?? null},
        ${module2.version ?? null},
        ${module2.sourceType ?? null},
        ${module2.sourceTemplateId ?? null},
        ${module2.status ?? null},
        ${module2.contentJson ? JSON.stringify(module2.contentJson) : null}::jsonb,
        ${module2.estimatedMinutes ?? null},
        ${module2.passingScore ?? null},
        ${module2.expiresInDays ?? null},
        ${module2.isRequired ?? null},
        ${module2.isPublished},
        ${module2.createdAt},
        ${module2.updatedAt}
      )
    `;
    return module2;
  },
  async getCertificationModuleById(moduleId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        machine_id as "machineId",
        title,
        description,
        version,
        source_type as "sourceType",
        source_template_id as "sourceTemplateId",
        status,
        content_json as "contentJson",
        estimated_minutes as "estimatedMinutes",
        passing_score as "passingScore",
        expires_in_days as "expiresInDays",
        is_required as "isRequired",
        is_published as "isPublished",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from certification_modules
      where id = ${moduleId}
      limit 1
    `;
    return rows[0] ?? null;
  },
  async getCertificationModulesByMakerspaceId(makerspaceId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        machine_id as "machineId",
        title,
        description,
        version,
        source_type as "sourceType",
        source_template_id as "sourceTemplateId",
        status,
        content_json as "contentJson",
        estimated_minutes as "estimatedMinutes",
        passing_score as "passingScore",
        expires_in_days as "expiresInDays",
        is_required as "isRequired",
        is_published as "isPublished",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from certification_modules
      where makerspace_id = ${makerspaceId}
      order by created_at desc
    `;
    return rows;
  },
  async updateCertificationModule(moduleId, updates) {
    const existing = await this.getCertificationModuleById(moduleId);
    if (!existing) return null;
    const next = {
      ...existing,
      ...updates
    };
    await sql`
      update certification_modules
      set
        machine_id = ${next.machineId ?? null},
        title = ${next.title},
        description = ${next.description ?? null},
        version = ${next.version ?? null},
        source_type = ${next.sourceType ?? null},
        source_template_id = ${next.sourceTemplateId ?? null},
        status = ${next.status ?? null},
        content_json = ${next.contentJson ? JSON.stringify(next.contentJson) : null}::jsonb,
        estimated_minutes = ${next.estimatedMinutes ?? null},
        passing_score = ${next.passingScore ?? null},
        expires_in_days = ${next.expiresInDays ?? null},
        is_required = ${next.isRequired ?? null},
        is_published = ${next.isPublished},
        updated_at = ${next.updatedAt}
      where id = ${moduleId}
    `;
    return next;
  },
  async createMachineCertification(machineCertification) {
    await sql`
      insert into machine_certifications (
        id,
        machine_id,
        certification_module_id,
        required,
        created_at
      ) values (
        ${machineCertification.id},
        ${machineCertification.machineId},
        ${machineCertification.certificationModuleId},
        ${machineCertification.required},
        ${machineCertification.createdAt}
      )
    `;
    return machineCertification;
  },
  async getMachineCertificationByMachineId(machineId) {
    const rows = await sql`
      select
        id,
        machine_id as "machineId",
        certification_module_id as "certificationModuleId",
        required,
        created_at as "createdAt"
      from machine_certifications
      where machine_id = ${machineId}
      limit 1
    `;
    return rows[0] ?? null;
  },
  async createCertificationAttempt(attempt) {
    await sql`
      insert into certification_attempts (
        id,
        makerspace_id,
        user_id,
        certification_module_id,
        score,
        passed,
        attempt_number,
        answers_json,
        created_at
      ) values (
        ${attempt.id},
        ${attempt.makerspaceId},
        ${attempt.userId},
        ${attempt.certificationModuleId},
        ${attempt.score},
        ${attempt.passed},
        ${attempt.attemptNumber},
        ${attempt.answersJson ?? null},
        ${attempt.createdAt}
      )
    `;
    return attempt;
  },
  async getCertificationAttemptsByUser(userId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        certification_module_id as "certificationModuleId",
        score,
        passed,
        attempt_number as "attemptNumber",
        answers_json as "answersJson",
        created_at as "createdAt"
      from certification_attempts
      where user_id = ${userId}
      order by created_at desc
    `;
    return rows;
  },
  async createUserCertification(userCertification) {
    await sql`
      insert into user_certifications (
        id,
        makerspace_id,
        user_id,
        certification_module_id,
        machine_id,
        status,
        earned_at,
        expires_at,
        created_at
      ) values (
        ${userCertification.id},
        ${userCertification.makerspaceId},
        ${userCertification.userId},
        ${userCertification.certificationModuleId},
        ${userCertification.machineId ?? null},
        ${userCertification.status},
        ${userCertification.earnedAt},
        ${userCertification.expiresAt ?? null},
        ${userCertification.createdAt}
      )
    `;
    return userCertification;
  },
  async updateUserCertification(certificationId, updates) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        certification_module_id as "certificationModuleId",
        machine_id as "machineId",
        status,
        earned_at as "earnedAt",
        expires_at as "expiresAt",
        created_at as "createdAt"
      from user_certifications
      where id = ${certificationId}
      limit 1
    `;
    const existing = rows[0];
    if (!existing) return null;
    const next = {
      ...existing,
      ...updates
    };
    await sql`
      update user_certifications
      set
        status = ${next.status},
        earned_at = ${next.earnedAt},
        expires_at = ${next.expiresAt ?? null}
      where id = ${certificationId}
    `;
    return next;
  },
  async getUserCertificationsByUser(userId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        certification_module_id as "certificationModuleId",
        machine_id as "machineId",
        status,
        earned_at as "earnedAt",
        expires_at as "expiresAt",
        created_at as "createdAt"
      from user_certifications
      where user_id = ${userId}
      order by created_at desc
    `;
    return rows;
  },
  async getUserCertificationForMachine(userId, machineId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        certification_module_id as "certificationModuleId",
        machine_id as "machineId",
        status,
        earned_at as "earnedAt",
        expires_at as "expiresAt",
        created_at as "createdAt"
      from user_certifications
      where user_id = ${userId}
        and machine_id = ${machineId}
      limit 1
    `;
    return rows[0] ?? null;
  },
  async getKnowledgeArticlesByMakerspace(makerspaceId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        title,
        content,
        machine_id as "machineId",
        tags,
        difficulty,
        created_at as "createdAt",
        updated_at as "updatedAt"
      from knowledge_articles
      where makerspace_id = ${makerspaceId}
      order by created_at desc
    `;
    return rows;
  },
  async getAdminMakerspaceByUserId(userId) {
    const membershipRows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        role,
        status,
        joined_at as "joinedAt",
        created_at as "createdAt"
      from memberships
      where user_id = ${userId}
        and role in ('owner', 'admin')
        and status = 'active'
        order by created_at desc
      limit 1
    `;
    const membership = membershipRows[0];
    if (!membership) return null;
    const makerspace = await this.getMakerspaceById(membership.makerspaceId);
    if (!makerspace) return null;
    const machines = await this.getMachinesByMakerspaceId(makerspace.id);
    const members = await sql`
      select
        m.id,
        m.user_id as "userId",
        u.full_name as "fullName",
        u.email,
        m.role,
        m.status,
        m.joined_at as "joinedAt"
      from memberships m
      join users u on u.id = m.user_id
      where m.makerspace_id = ${makerspace.id}
      order by m.created_at asc
    `;
    return {
      makerspace,
      machines,
      members
    };
  },
  async getMachineCertificationsByMakerspaceId(makerspaceId) {
    const rows = await sql`
      select
        mc.id,
        mc.machine_id as "machineId",
        mc.certification_module_id as "certificationModuleId",
        mc.required,
        mc.created_at as "createdAt"
      from machine_certifications mc
      join machines m on m.id = mc.machine_id
      where m.makerspace_id = ${makerspaceId}
      order by mc.created_at desc
    `;
    return rows;
  },
  async getMachineCertificationById(machineCertificationId) {
    const rows = await sql`
      select
        id,
        machine_id as "machineId",
        certification_module_id as "certificationModuleId",
        required,
        created_at as "createdAt"
      from machine_certifications
      where id = ${machineCertificationId}
      limit 1
    `;
    return rows[0] ?? null;
  },
  async updateMachineCertification(machineCertificationId, updates) {
    await sql`
      update machine_certifications
      set
        required = ${updates.required}
      where id = ${machineCertificationId}
    `;
    return {
      id: machineCertificationId,
      ...updates
    };
  },
  async getPendingCertificationApprovals(makerspaceId) {
    const rows = await sql`
      select
        uc.id,
        uc.user_id as "userId",
        u.full_name as "userName",
        u.email as "userEmail",
        uc.certification_module_id as "certificationModuleId",
        cm.title as "certificationTitle",
        uc.machine_id as "machineId",
        m.name as "machineName",
        uc.status,
        uc.earned_at as "earnedAt",
        uc.expires_at as "expiresAt",
        uc.created_at as "createdAt"
      from user_certifications uc
      left join users u on u.id = uc.user_id
      left join certification_modules cm on cm.id = uc.certification_module_id
      left join machines m on m.id = uc.machine_id
      where uc.makerspace_id = ${makerspaceId}
        and uc.status = 'pending_review'
      order by uc.created_at desc
    `;
    return rows;
  },
  async updateUserCertificationStatus(certificationId, status) {
    const rows = await sql`
      update user_certifications
      set status = ${status}
      where id = ${certificationId}
      returning
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        certification_module_id as "certificationModuleId",
        machine_id as "machineId",
        status,
        earned_at as "earnedAt",
        expires_at as "expiresAt",
        created_at as "createdAt"
    `;
    return rows[0] ?? null;
  },
  async getUserByEmail(email) {
    const rows = await sql`
      select
        id,
        email,
        full_name as "fullName",
        avatar_url as "avatarUrl",
        password_hash as "passwordHash",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from users
      where lower(email) = lower(${email})
      limit 1
    `;
    return rows[0] ?? null;
  },
  async createUser(user) {
    await sql`
      insert into users (
        id,
        email,
        full_name,
        avatar_url,
        password_hash,
        created_at,
        updated_at
      ) values (
        ${user.id},
        ${user.email},
        ${user.fullName},
        ${user.avatarUrl ?? null},
        ${user.passwordHash ?? null},
        ${user.createdAt},
        ${user.updatedAt}
      )
    `;
    return user;
  },
  async markMakerspaceOnboardingComplete(makerspaceId) {
    const now = nowIso();
    const rows = await sql`
      update makerspaces
      set
        onboarding_completed = true,
        onboarding_completed_at = ${now},
        updated_at = ${now}
      where id = ${makerspaceId}
      returning
        id,
        name,
        slug,
        location,
        description,
        website,
        logo_url as "logoUrl",
        created_by_user_id as "createdByUserId",
        onboarding_completed as "onboardingCompleted",
        onboarding_completed_at as "onboardingCompletedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
    return rows[0] ?? null;
  },
  async createCertificationReviewRequest(request) {
    const rows = await sql`
      insert into certification_review_requests (
        id,
        makerspace_id,
        user_id,
        certification_module_id,
        machine_id,
        staff_user_id,
        requested_date,
        requested_time,
        notes,
        status,
        created_at,
        updated_at
      ) values (
        ${request.id},
        ${request.makerspaceId},
        ${request.userId},
        ${request.certificationModuleId},
        ${request.machineId ?? null},
        ${request.staffUserId ?? null},
        ${request.requestedDate},
        ${request.requestedTime},
        ${request.notes ?? ""},
        ${request.status ?? "pending"},
        ${request.createdAt},
        ${request.updatedAt}
      )
      returning
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        certification_module_id as "certificationModuleId",
        machine_id as "machineId",
        staff_user_id as "staffUserId",
        requested_date as "requestedDate",
        requested_time as "requestedTime",
        notes,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
    return rows[0] ?? null;
  },
  async getCertificationReviewRequestsByMakerspaceId(makerspaceId) {
    const rows = await sql`
      select
        r.id,
        r.makerspace_id as "makerspaceId",
        r.user_id as "userId",
        member.full_name as "memberName",
        member.email as "memberEmail",
        member.avatar_url as "memberAvatarUrl",
  
        r.certification_module_id as "certificationModuleId",
        cm.title as "certificationTitle",
  
        r.machine_id as "machineId",
        machine.name as "machineName",
  
        r.staff_user_id as "staffUserId",
        staff.full_name as "staffName",
        staff.email as "staffEmail",
        staff.avatar_url as "staffAvatarUrl",
  
        r.requested_date as "requestedDate",
        r.requested_time as "requestedTime",
        r.notes,
        r.status,
        r.created_at as "createdAt",
        r.updated_at as "updatedAt"
      from certification_review_requests r
      left join users member on member.id = r.user_id
      left join users staff on staff.id = r.staff_user_id
      left join certification_modules cm on cm.id = r.certification_module_id
      left join machines machine on machine.id = r.machine_id
      where r.makerspace_id = ${makerspaceId}
      order by
        case
          when r.status = 'pending' then 1
          when r.status = 'scheduled' then 2
          when r.status = 'completed' then 3
          when r.status = 'rejected' then 4
          else 5
        end,
        r.requested_date asc,
        r.requested_time asc,
        r.created_at desc
    `;
    return rows;
  },
  async getCertificationReviewRequestById(requestId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        certification_module_id as "certificationModuleId",
        machine_id as "machineId",
        staff_user_id as "staffUserId",
        requested_date as "requestedDate",
        requested_time as "requestedTime",
        notes,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      from certification_review_requests
      where id = ${requestId}
      limit 1
    `;
    return rows[0] ?? null;
  },
  async updateCertificationReviewRequestStatus(requestId, status) {
    const now = nowIso();
    const rows = await sql`
      update certification_review_requests
      set
        status = ${status},
        updated_at = ${now}
      where id = ${requestId}
      returning
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        certification_module_id as "certificationModuleId",
        machine_id as "machineId",
        staff_user_id as "staffUserId",
        requested_date as "requestedDate",
        requested_time as "requestedTime",
        notes,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
    return rows[0] ?? null;
  },
  async getUserCertificationForReview(args) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        user_id as "userId",
        certification_module_id as "certificationModuleId",
        machine_id as "machineId",
        status,
        earned_at as "earnedAt",
        expires_at as "expiresAt",
        created_at as "createdAt"
      from user_certifications
      where user_id = ${args.userId}
        and certification_module_id = ${args.certificationModuleId}
        and (
          ${args.machineId ?? null}::text is null
          or machine_id = ${args.machineId ?? null}
        )
      order by created_at desc
      limit 1
    `;
    return rows[0] ?? null;
  },
  async getStaffReviewersByMakerspaceId(makerspaceId) {
    const rows = await sql`
      select
        u.id,
        u.full_name as "fullName",
        u.email,
        u.avatar_url as "avatarUrl",
        m.role
      from memberships m
      join users u on u.id = m.user_id
      where m.makerspace_id = ${makerspaceId}
        and m.status = 'active'
        and m.role in ('owner', 'admin', 'instructor')
      order by
        case
          when m.role = 'instructor' then 1
          when m.role = 'admin' then 2
          when m.role = 'owner' then 3
          else 4
        end,
        u.full_name asc
    `;
    return rows;
  },
  async getCertificationReviewRequestsByUser(userId) {
    const rows = await sql`
      select
        r.id,
        r.makerspace_id as "makerspaceId",
        r.user_id as "userId",
        r.certification_module_id as "certificationModuleId",
        cm.title as "certificationTitle",
        r.machine_id as "machineId",
        machine.name as "machineName",
        r.staff_user_id as "staffUserId",
        staff.full_name as "staffName",
        staff.avatar_url as "staffAvatarUrl",
        r.requested_date as "requestedDate",
        r.requested_time as "requestedTime",
        r.notes,
        r.status,
        r.created_at as "createdAt",
        r.updated_at as "updatedAt"
      from certification_review_requests r
      left join certification_modules cm on cm.id = r.certification_module_id
      left join machines machine on machine.id = r.machine_id
      left join users staff on staff.id = r.staff_user_id
      where r.user_id = ${userId}
      order by r.created_at desc
    `;
    return rows;
  },
  async getMachineBookingsByUser(userId) {
    const rows = await sql`
      select
        b.id,
        b.makerspace_id as "makerspaceId",
        b.user_id as "userId",
        b.machine_id as "machineId",
        machine.name as "machineName",
        b.starts_at as "startsAt",
        b.ends_at as "endsAt",
        b.status,
        b.notes,
        b.created_at as "createdAt",
        b.updated_at as "updatedAt"
      from machine_bookings b
      left join machines machine on machine.id = b.machine_id
      where b.user_id = ${userId}
      order by b.starts_at asc
    `;
    return rows;
  },
  async getPublishedAnnouncementsByMakerspaceId(makerspaceId) {
    const rows = await sql`
      select
        id,
        makerspace_id as "makerspaceId",
        title,
        body,
        audience,
        status,
        published_at as "publishedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from makerspace_announcements
      where makerspace_id = ${makerspaceId}
        and status = 'published'
      order by published_at desc nulls last, created_at desc
      limit 10
    `;
    return rows;
  },
  async getPublicMakerspacesForDirectory() {
    const rows = await sql`
      select
        ms.id,
        ms.name,
        ms.slug,
        ms.location,
        ms.description,
        ms.website,
        ms.logo_url as "logoUrl",
        ms.created_at as "createdAt",
        count(distinct machines.id)::int as "machineCount",
        count(distinct memberships.id)::int as "memberCount"
      from makerspaces ms
      left join machines on machines.makerspace_id = ms.id
      left join memberships on memberships.makerspace_id = ms.id
        and memberships.status = 'active'
      group by
        ms.id,
        ms.name,
        ms.slug,
        ms.location,
        ms.description,
        ms.website,
        ms.logo_url,
        ms.created_at
      order by ms.created_at desc
    `;
    return rows;
  }
};

// server/auth.ts
var PgSession = (0, import_connect_pg_simple.default)(import_express_session.default);
function setupAuth(app2) {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not set");
  }
  app2.set("trust proxy", 1);
  app2.use(
    (0, import_express_session.default)({
      store: new PgSession({
        conString: process.env.POSTGRES_URL,
        tableName: "sessions",
        createTableIfMissing: true
      }),
      secret: process.env.SESSION_SECRET || "dev-secret-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1e3 * 60 * 60 * 24 * 14
      }
    })
  );
}
async function hashPassword(password) {
  return import_bcryptjs.default.hash(password, 12);
}
async function verifyPassword(password, passwordHash) {
  return import_bcryptjs.default.compare(password, passwordHash);
}
async function createUserWithPassword(args) {
  const now = nowIso();
  const passwordHash = await hashPassword(args.password);
  return storage.createUser({
    id: createId("user"),
    email: args.email.toLowerCase().trim(),
    fullName: args.fullName.trim(),
    passwordHash,
    createdAt: now,
    updatedAt: now
  });
}

// server/certifications/prusa-mk4s.json
var prusa_mk4s_default = {
  id: "prusa-mk4s-cert-v1",
  title: "Prusa MK4S Operator Badge",
  subtitle: "Safe setup, first print, and quality checks",
  machineType: "3d_printer",
  version: "1.0.0",
  passingScore: 80,
  estimatedMinutes: 8,
  levels: [
    {
      id: "intro-lesson",
      type: "lesson",
      title: "Welcome to the Prusa MK4S",
      shortTitle: "Intro",
      xp: 10,
      narrative: [
        "The Prusa MK4S is a reliable fused-filament 3D printer used for rapid prototyping and finished parts.",
        "Before printing, always check the machine status, confirm the correct filament is loaded, and inspect the bed surface.",
        "Your goal in this certification is to learn safe startup, first-layer quality checks, and basic troubleshooting."
      ],
      media: {
        kind: "image",
        url: "/images/certifications/prusa-mk4s/intro-overview.jpg",
        alt: "Prusa MK4S overview"
      },
      callouts: [
        "Never start a print on a dirty build plate.",
        "Do not leave the first layer unchecked.",
        "Stop the machine if filament is tangled or the nozzle collides."
      ],
      keyTakeaways: [
        "Know the machine before starting.",
        "Check bed, filament, and slicer profile.",
        "Watch the first layer closely."
      ],
      ctaLabel: "Start training"
    },
    {
      id: "startup-scenario",
      type: "scenario",
      title: "Before You Press Print",
      shortTitle: "Startup",
      xp: 20,
      prompt: "You are preparing a print on the MK4S. What is the best first action?",
      situation: "The bed has fingerprints on it, filament is loaded, and the print file is ready.",
      choices: [
        {
          id: "start-immediately",
          label: "Start the print immediately since the file is ready.",
          isCorrect: false,
          feedback: "Not quite. A dirty bed can cause first-layer adhesion problems."
        },
        {
          id: "clean-bed",
          label: "Clean the build plate before starting the print.",
          isCorrect: true,
          feedback: "Correct. Cleaning the build plate is one of the most important pre-print checks."
        },
        {
          id: "increase-temp",
          label: "Raise nozzle temperature first to improve adhesion.",
          isCorrect: false,
          feedback: "Temperature matters, but bed cleanliness is the priority in this situation."
        }
      ]
    },
    {
      id: "hotspot-bed-check",
      type: "hotspot",
      title: "Spot the First-Layer Problems",
      shortTitle: "Layer Check",
      xp: 25,
      prompt: "Tap the areas that would make you stop and inspect the print.",
      imageUrl: "/images/certifications/prusa-mk4s/first-layer-check.jpg",
      imageAlt: "First layer quality check on Prusa MK4S bed",
      hotspots: [
        {
          id: "lifted-corner",
          x: 18,
          y: 72,
          radius: 8,
          label: "Lifted corner",
          isCorrect: true,
          feedback: "Correct. A lifted corner suggests poor bed adhesion."
        },
        {
          id: "gapped-lines",
          x: 52,
          y: 41,
          radius: 8,
          label: "Visible gaps between lines",
          isCorrect: true,
          feedback: "Correct. Gaps in the first layer can indicate poor Z height or adhesion."
        },
        {
          id: "smooth-area",
          x: 78,
          y: 28,
          radius: 8,
          label: "Smooth, even layer area",
          isCorrect: false,
          feedback: "This area looks acceptable and would not be your first reason to stop."
        }
      ],
      minCorrect: 2
    },
    {
      id: "quick-check-safety",
      type: "quick_check",
      title: "Quick Safety Check",
      shortTitle: "Safety",
      xp: 20,
      questions: [
        {
          id: "q1",
          prompt: "What should you do if the first layer is not sticking?",
          choices: [
            {
              id: "q1a",
              label: "Let it continue for a while and see if it fixes itself.",
              isCorrect: false
            },
            {
              id: "q1b",
              label: "Stop the print, inspect the bed, and correct the issue.",
              isCorrect: true
            },
            {
              id: "q1c",
              label: "Ignore it if only one corner is lifting.",
              isCorrect: false
            }
          ],
          explanation: "First-layer issues usually get worse, not better. Stop early and fix the cause."
        },
        {
          id: "q2",
          prompt: "Which material is usually easiest for beginners to print on the Prusa MK4S?",
          choices: [
            {
              id: "q2a",
              label: "PLA",
              isCorrect: true
            },
            {
              id: "q2b",
              label: "Nylon",
              isCorrect: false
            },
            {
              id: "q2c",
              label: "Polycarbonate",
              isCorrect: false
            }
          ],
          explanation: "PLA is generally the best starting material because it is easier to print and troubleshoot."
        }
      ]
    },
    {
      id: "final-scenario",
      type: "scenario",
      title: "Ready to Run",
      shortTitle: "Final Check",
      xp: 25,
      prompt: "You cleaned the bed, loaded the right filament, sliced with the correct profile, and started the print. What should you do next?",
      situation: "The print has just started and the nozzle is laying down the first lines.",
      choices: [
        {
          id: "walk-away",
          label: "Walk away immediately since the print file is known-good.",
          isCorrect: false,
          feedback: "Not yet. The first layer is the most important moment to observe."
        },
        {
          id: "watch-first-layer",
          label: "Watch the first layer for the first few minutes and confirm it is smooth and sticking well.",
          isCorrect: true,
          feedback: "Correct. Always watch the first layer before leaving the machine."
        },
        {
          id: "increase-speed",
          label: "Increase print speed right away to save time.",
          isCorrect: false,
          feedback: "That increases risk. Confirm a stable first layer before changing settings."
        }
      ]
    }
  ]
};

// server/services/admin-onboarding.service.ts
async function ensureUserExists(userId) {
  const existing = await storage.getUserById(userId);
  if (existing) return existing;
  const now = nowIso();
  const fallbackUser = {
    id: userId,
    email: `${userId}@local.dev`,
    fullName: "Dev User",
    createdAt: now,
    updatedAt: now
  };
  await storage.createUser(fallbackUser);
  return fallbackUser;
}
async function uniqueMakerspaceSlug(base) {
  const normalized = slugify(base) || "makerspace";
  let candidate = normalized;
  let counter = 2;
  while (await storage.getMakerspaceBySlug(candidate)) {
    candidate = `${normalized}-${counter}`;
    counter += 1;
  }
  return candidate;
}
async function uniqueMachineSlug(makerspaceId, base) {
  const normalized = slugify(base) || "machine";
  let candidate = normalized;
  let counter = 2;
  const existingMachines = await storage.getMachinesByMakerspaceId(makerspaceId);
  while (existingMachines.some((m) => m.slug === candidate)) {
    candidate = `${normalized}-${counter}`;
    counter += 1;
  }
  return candidate;
}
async function publishAdminOnboarding({
  userId,
  payload
}) {
  if (!payload?.makerspace || !payload?.machine) {
    throw new Error("Missing required onboarding payload.");
  }
  await ensureUserExists(userId);
  const now = nowIso();
  const existingAdminView = await storage.getAdminMakerspaceByUserId(userId);
  let makerspace;
  if (existingAdminView?.makerspace) {
    const existingMakerspace = existingAdminView.makerspace;
    const updatedMakerspace = await storage.updateMakerspace(
      existingMakerspace.id,
      {
        name: payload.makerspace.name.trim(),
        slug: payload.makerspace.slug?.trim() || existingMakerspace.slug || await uniqueMakerspaceSlug(payload.makerspace.name),
        location: payload.makerspace.location.trim(),
        description: payload.makerspace.description.trim(),
        website: payload.makerspace.website?.trim() || void 0,
        logoUrl: payload.makerspace.logoUrl?.trim() || void 0,
        onboardingCompleted: true,
        updatedAt: now
      }
    );
    if (!updatedMakerspace) {
      throw new Error("Failed to update onboarding makerspace.");
    }
    makerspace = updatedMakerspace;
  } else {
    makerspace = {
      id: createId("ms"),
      name: payload.makerspace.name.trim(),
      slug: await uniqueMakerspaceSlug(
        payload.makerspace.slug || payload.makerspace.name
      ),
      location: payload.makerspace.location.trim(),
      description: payload.makerspace.description.trim(),
      website: payload.makerspace.website?.trim() || void 0,
      logoUrl: payload.makerspace.logoUrl?.trim() || void 0,
      createdByUserId: userId,
      onboardingCompleted: true,
      createdAt: now,
      updatedAt: now
    };
    await storage.createMakerspace(makerspace);
    const membership = {
      id: createId("membership"),
      makerspaceId: makerspace.id,
      userId,
      role: "owner",
      status: "active",
      joinedAt: now,
      createdAt: now
    };
    await storage.createMembership(membership);
  }
  const machine = {
    id: createId("machine"),
    makerspaceId: makerspace.id,
    name: payload.machine.name.trim(),
    slug: await uniqueMachineSlug(makerspace.id, payload.machine.name),
    type: payload.machine.type,
    brand: payload.machine.brand?.trim() || void 0,
    model: payload.machine.model?.trim() || void 0,
    locationLabel: payload.machine.locationLabel.trim(),
    description: payload.machine.description.trim(),
    imageUrl: payload.machine.imageUrl?.trim() || void 0,
    requiresCertification: payload.machine.requiresCertification,
    status: "active",
    createdAt: now,
    updatedAt: now
  };
  await storage.createMachine(machine);
  let certificationModule;
  let machineCertification;
  if (machine.requiresCertification && payload.certification && payload.certification.mode !== "none") {
    certificationModule = {
      id: createId("certmod"),
      makerspaceId: makerspace.id,
      machineId: machine.id,
      title: payload.certification.title?.trim() || `${machine.name} Certification`,
      description: "",
      version: "1.0.0",
      sourceType: payload.certification.mode === "template" || payload.certification.mode === "duplicate" || payload.certification.mode === "custom" ? payload.certification.mode : "custom",
      sourceTemplateId: payload.certification.templateId || null,
      status: "published",
      contentJson: payload.certification.mode === "template" ? prusa_mk4s_default : payload.certification.contentJson ?? null,
      estimatedMinutes: payload.certification.estimatedMinutes ?? null,
      passingScore: payload.certification.passingScore ?? null,
      expiresInDays: null,
      isRequired: true,
      isPublished: true,
      createdAt: now,
      updatedAt: now
    };
    await storage.createCertificationModule(certificationModule);
    machineCertification = {
      id: createId("machinecert"),
      machineId: machine.id,
      certificationModuleId: certificationModule.id,
      required: true,
      createdAt: now
    };
    await storage.createMachineCertification(machineCertification);
  }
  return {
    makerspaceId: makerspace.id,
    machineId: machine.id,
    certificationModuleId: certificationModule?.id,
    redirectTo: "/app/admin/makerspace"
  };
}
async function getAdminMakerspaceByUserId(userId) {
  return storage.getAdminMakerspaceByUserId(userId);
}

// server/certifications/templates.ts
var certificationTemplates = [
  {
    id: "prusa-mk4s-operator-badge",
    title: "Prusa MK4S Operator Badge",
    description: "Beginner certification for safe Prusa MK4S operation.",
    machineTypes: ["3d_printer"],
    estimatedMinutes: 8,
    passingScore: 80,
    levelsCount: 5,
    tags: ["3D Printing", "Beginner"]
  },
  {
    id: "laser-cutter-safety-core",
    title: "Laser Cutter Safety Core",
    description: "Safety-first laser cutter certification.",
    machineTypes: ["laser_cutter"],
    estimatedMinutes: 12,
    passingScore: 85,
    levelsCount: 6,
    tags: ["Laser", "Safety"]
  },
  {
    id: "cnc-router-safety-core",
    title: "CNC Router Safety Core",
    description: "Intro certification for CNC router safety, setup, hold-downs, and emergency stop.",
    machineTypes: ["cnc_router"],
    estimatedMinutes: 15,
    passingScore: 85,
    levelsCount: 7,
    tags: ["CNC", "Router", "Safety"]
  },
  {
    id: "waterjet-cutter-safety-core",
    title: "Waterjet Cutter Safety Core",
    description: "Safety certification for waterjet setup, material handling, piercing, and shutdown.",
    machineTypes: ["other"],
    estimatedMinutes: 15,
    passingScore: 85,
    levelsCount: 6,
    tags: ["Waterjet", "Safety"]
  },
  {
    id: "vinyl-cutter-basic-operator",
    title: "Vinyl Cutter Basic Operator",
    description: "Beginner certification for vinyl cutter setup, blade depth, material loading, and weeding.",
    machineTypes: ["vinyl_cutter"],
    estimatedMinutes: 8,
    passingScore: 80,
    levelsCount: 4,
    tags: ["Vinyl", "Beginner"]
  }
];

// server/routes/admin-onboarding.ts
function registerAdminOnboardingRoutes(app2) {
  app2.post("/api/admin/onboarding/publish", async (req, res) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
      const payload = req.body;
      const result = await publishAdminOnboarding({
        userId,
        payload
      });
      console.log("Onboarding publish result:", result);
      console.log("Marking onboarding complete for:", result.makerspaceId);
      console.log("HIT THIS ONBOARDING PUBLISH ROUTE");
      await storage.markMakerspaceOnboardingComplete(result.makerspaceId);
      return res.status(201).json({
        ...result,
        onboardingCompleted: true
      });
    } catch (error) {
      console.error("Failed to publish onboarding:", error);
      return res.status(500).json({
        message: "Failed to publish onboarding"
      });
    }
  });
  app2.get(
    "/api/admin/onboarding/certification-templates",
    async (_req, res) => {
      return res.status(200).json({
        templates: certificationTemplates
      });
    }
  );
}

// server/routes/admin-makerspace.ts
function registerAdminMakerspaceRoutes(app2) {
  app2.get("/api/admin/makerspace", async (req, res) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      console.log("ADMIN MAKERSPACE SESSION USER:", req.session?.userId);
      console.log("ADMIN MAKERSPACE REQ USER:", req.user?.id);
      console.log("ADMIN MAKERSPACE USING USER:", userId);
      const data = await getAdminMakerspaceByUserId(userId);
      if (!data) {
        return res.status(404).json({
          message: "No makerspace found for this admin"
        });
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error("Failed to load admin makerspace:", error);
      return res.status(500).json({
        message: "Failed to load admin makerspace"
      });
    }
  });
  app2.patch("/api/admin/makerspace", async (req, res) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const adminView = await storage.getAdminMakerspaceByUserId(userId);
      if (!adminView) {
        return res.status(404).json({ message: "No makerspace found" });
      }
      const updated = await storage.updateMakerspace(adminView.makerspace.id, {
        name: req.body.name,
        location: req.body.location,
        website: req.body.website,
        description: req.body.description,
        logoUrl: req.body.logoUrl,
        updatedAt: nowIso()
      });
      return res.status(200).json({ makerspace: updated });
    } catch (error) {
      console.error("Failed to update makerspace:", error);
      return res.status(500).json({
        message: "Failed to update makerspace"
      });
    }
  });
}

// server/routes/machines.ts
function registerMachineRoutes(app2) {
  app2.post("/api/admin/machines", async (req, res) => {
    try {
      console.log("HIT POST /api/admin/machines");
      const userId = req.session?.userId ?? req.user?.id;
      const body = req.body;
      const adminView = await storage.getAdminMakerspaceByUserId(userId);
      if (!adminView) {
        return res.status(404).json({
          message: "No makerspace found for admin"
        });
      }
      const makerspaceId = adminView.makerspace.id;
      const quantity = Math.max(1, Number(req.body.quantity ?? 1));
      const existingMachines = await storage.getMachinesByMakerspaceId(makerspaceId);
      const now = nowIso();
      const baseName = body.name?.trim() || "Unnamed Machine";
      const baseSlug = slugify(baseName || "machine");
      const createdMachines = [];
      let slugCounter = 1;
      for (let i = 1; i <= quantity; i += 1) {
        const displayName = quantity > 1 ? `${baseName} #${i}` : baseName;
        let candidateSlug = quantity > 1 ? `${baseSlug}-${i}` : baseSlug;
        while (existingMachines.some((m) => m.slug === candidateSlug) || createdMachines.some((m) => m.slug === candidateSlug)) {
          slugCounter += 1;
          candidateSlug = `${baseSlug}-${slugCounter}`;
        }
        const machine = {
          id: createId("machine"),
          makerspaceId,
          name: displayName,
          slug: candidateSlug,
          type: body.type?.trim() || "other",
          brand: body.brand?.trim() || void 0,
          model: body.model?.trim() || void 0,
          locationLabel: body.locationLabel?.trim() || "Unassigned",
          description: body.description?.trim() || "",
          imageUrl: body.imageUrl?.trim() || void 0,
          requiresCertification: !!body.requiresCertification,
          status: "active",
          catalogSourceId: typeof body.catalogSourceId === "number" ? body.catalogSourceId : void 0,
          createdAt: now,
          updatedAt: now
        };
        const createdMachine = await storage.createMachine(machine);
        createdMachines.push(createdMachine);
      }
      return res.status(201).json({
        machine: createdMachines[0],
        machines: createdMachines
      });
    } catch (error) {
      console.error("Failed to create machine:", error);
      return res.status(500).json({
        message: "Failed to create machine"
      });
    }
  });
  app2.get("/api/admin/machines", async (req, res) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
      const adminView = await storage.getAdminMakerspaceByUserId(userId);
      if (!adminView) {
        return res.status(404).json({
          message: "No makerspace found for admin"
        });
      }
      return res.status(200).json({
        machines: adminView.machines
      });
    } catch (error) {
      console.error("Failed to load machines:", error);
      return res.status(500).json({
        message: "Failed to load machines"
      });
    }
  });
  app2.get("/api/admin/machines/:machineId", async (req, res) => {
    try {
      const machineId = req.params.machineId;
      const machine = await storage.getMachineById(machineId);
      if (!machine) {
        return res.status(404).json({
          message: "Machine not found"
        });
      }
      return res.status(200).json({ machine });
    } catch (error) {
      console.error("Failed to load machine:", error);
      return res.status(500).json({
        message: "Failed to load machine"
      });
    }
  });
  app2.patch("/api/admin/machines/:machineId", async (req, res) => {
    try {
      const machineId = req.params.machineId;
      const body = req.body;
      const updated = await storage.updateMachine(machineId, {
        name: body.name,
        type: body.type,
        brand: body.brand,
        model: body.model,
        locationLabel: body.locationLabel,
        description: body.description,
        requiresCertification: body.requiresCertification,
        status: body.status,
        updatedAt: nowIso()
      });
      if (!updated) {
        return res.status(404).json({
          message: "Machine not found"
        });
      }
      return res.status(200).json({
        machine: updated
      });
    } catch (error) {
      console.error("Failed to update machine:", error);
      return res.status(500).json({
        message: "Failed to update machine"
      });
    }
  });
  app2.delete("/api/admin/machines/:machineId", async (req, res) => {
    try {
      const machineId = req.params.machineId;
      const success = await storage.deleteMachine(machineId);
      if (!success) {
        return res.status(404).json({
          message: "Machine not found"
        });
      }
      return res.status(200).json({
        success: true
      });
    } catch (error) {
      console.error("Failed to delete machine:", error);
      return res.status(500).json({
        message: "Failed to delete machine"
      });
    }
  });
}

// server/routes/machine-certifications.ts
function registerMachineCertificationRoutes(app2) {
  app2.get("/api/admin/machines/:machineId/certification", async (req, res) => {
    try {
      const machineId = req.params.machineId;
      console.log("GET cert route machineId:", machineId);
      const machine = await storage.getMachineById(machineId);
      console.log("GET cert route machine:", machine);
      if (!machine) {
        return res.status(404).json({ message: "Machine not found" });
      }
      const machineCertification = await storage.getMachineCertificationByMachineId(machineId);
      console.log("GET cert route machineCertification:", machineCertification);
      let activeProgram = null;
      if (machineCertification) {
        activeProgram = await storage.getCertificationModuleById(
          machineCertification.certificationModuleId
        );
      }
      console.log("GET cert route activeProgram:", activeProgram);
      const templates = [
        {
          id: "prusa-mk4s-operator-badge",
          title: "Prusa MK4S Operator Badge",
          description: "Beginner certification for safe Prusa MK4S operation.",
          machineTypes: ["3d_printer", "3D Printing"],
          estimatedMinutes: 8,
          passingScore: 80,
          levelsCount: 5,
          tags: ["3D Printing", "Beginner"]
        },
        {
          id: "laser-cutter-safety-core",
          title: "Laser Cutter Safety Core",
          description: "Safety-first laser cutter certification.",
          machineTypes: ["laser_cutter", "Laser"],
          estimatedMinutes: 12,
          passingScore: 85,
          levelsCount: 6,
          tags: ["Laser", "Safety"]
        },
        {
          id: "cnc-router-safety-core",
          title: "CNC Router Safety Core",
          description: "Intro certification for CNC router safety, setup, hold-downs, and emergency stop.",
          machineTypes: ["cnc_router", "CNC Router", "CNC"],
          estimatedMinutes: 15,
          passingScore: 85,
          levelsCount: 7,
          tags: ["CNC", "Router", "Safety"]
        },
        {
          id: "cnc-mill-basic-operator",
          title: "CNC Mill Basic Operator",
          description: "Beginner certification for CNC mill setup, workholding, tool awareness, and safe operation.",
          machineTypes: ["cnc_mill", "CNC Mill", "CNC"],
          estimatedMinutes: 18,
          passingScore: 85,
          levelsCount: 7,
          tags: ["CNC", "Mill", "Operator"]
        },
        {
          id: "waterjet-cutter-safety-core",
          title: "Waterjet Cutter Safety Core",
          description: "Safety certification for waterjet setup, material handling, piercing, and shutdown.",
          machineTypes: ["waterjet", "Waterjet Cutter"],
          estimatedMinutes: 15,
          passingScore: 85,
          levelsCount: 6,
          tags: ["Waterjet", "Safety"]
        },
        {
          id: "vinyl-cutter-basic-operator",
          title: "Vinyl Cutter Basic Operator",
          description: "Beginner certification for vinyl cutter setup, blade depth, material loading, and weeding.",
          machineTypes: ["vinyl_cutter", "Vinyl Cutter"],
          estimatedMinutes: 8,
          passingScore: 80,
          levelsCount: 4,
          tags: ["Vinyl", "Beginner"]
        }
        // {
        //   id: "sewing-machine-basic-operator",
        //   title: "Sewing Machine Basic Operator",
        //   description: "Basic sewing machine certification for threading, needle safety, fabric handling, and cleanup.",
        //   machineTypes: ["sewing_machine", "Textiles"],
        //   estimatedMinutes: 10,
        //   passingScore: 80,
        //   levelsCount: 5,
        //   tags: ["Textiles", "Beginner"],
        // },
        // {
        //   id: "woodshop-tool-safety-core",
        //   title: "Woodshop Tool Safety Core",
        //   description: "General certification for woodshop PPE, dust collection, safe cuts, and tool readiness.",
        //   machineTypes: ["woodshop", "Table Saw", "Bandsaw", "Miter Saw"],
        //   estimatedMinutes: 15,
        //   passingScore: 85,
        //   levelsCount: 6,
        //   tags: ["Woodshop", "Safety"],
        // },
      ];
      console.log(
        "CERT TEMPLATE IDS:",
        templates.map((t) => `${t.id} - ${t.title}`)
      );
      const requiresCertification = machineCertification?.required ?? activeProgram?.isRequired ?? machine.requiresCertification ?? false;
      return res.status(200).json({
        machine: {
          ...machine,
          requiresCertification
        },
        activeProgram: activeProgram ? {
          ...activeProgram,
          isRequired: requiresCertification
        } : null,
        requiresCertification,
        templates
      });
    } catch (error) {
      console.error("Failed to load machine certification page:", error);
      return res.status(500).json({
        message: "Failed to load machine certification page"
      });
    }
  });
  app2.post("/api/admin/machines/:machineId/certification", async (req, res) => {
    try {
      const machineId = req.params.machineId;
      const machine = await storage.getMachineById(machineId);
      if (!machine) {
        return res.status(404).json({ message: "Machine not found" });
      }
      const body = req.body;
      const now = nowIso();
      const machineCertification = await storage.getMachineCertificationByMachineId(machineId);
      const existingModules = await storage.getCertificationModulesByMakerspaceId(
        machine.makerspaceId
      );
      const existing = existingModules.find(
        (module2) => module2.machineId === machineId
      );
      if (existing) {
        const updated = await storage.updateCertificationModule(existing.id, {
          title: body.title,
          description: body.description,
          sourceType: body.sourceType,
          sourceTemplateId: body.sourceTemplateId ?? null,
          estimatedMinutes: Number(body.estimatedMinutes ?? 10),
          passingScore: Number(body.passingScore ?? 80),
          expiresInDays: body.expiresInDays ?? null,
          isRequired: !!body.isRequired,
          status: body.status,
          contentJson: body.contentJson ?? existing.contentJson ?? null,
          isPublished: body.status === "published",
          updatedAt: now
        });
        if (machineCertification) {
          await storage.updateMachineCertification(machineCertification.id, {
            required: !!body.isRequired
          });
          await storage.updateMachine(machineId, {
            requiresCertification: !!body.isRequired,
            updatedAt: now
          });
        }
        return res.status(200).json({ program: updated });
      }
      const program = {
        id: createId("certprog"),
        makerspaceId: machine.makerspaceId,
        machineId: machine.id,
        title: body.title || `${machine.name} Certification`,
        description: body.description || "",
        version: "1.0.0",
        sourceType: body.sourceType || "custom",
        sourceTemplateId: body.sourceTemplateId ?? null,
        status: body.status || "draft",
        passingScore: Number(body.passingScore ?? 80),
        estimatedMinutes: Number(body.estimatedMinutes ?? 10),
        expiresInDays: body.expiresInDays ?? null,
        isRequired: !!body.isRequired,
        contentJson: body.contentJson ?? null,
        isPublished: body.status === "published",
        createdAt: now,
        updatedAt: now
      };
      await storage.createCertificationModule(program);
      await storage.createMachineCertification({
        id: createId("machinecert"),
        machineId: machine.id,
        certificationModuleId: program.id,
        required: !!body.isRequired,
        createdAt: now
      });
      await storage.updateMachine(machineId, {
        requiresCertification: !!body.isRequired,
        updatedAt: now
      });
      return res.status(201).json({ program });
    } catch (error) {
      console.error("Failed to save machine certification:", error);
      return res.status(500).json({
        message: "Failed to save machine certification"
      });
    }
  });
  app2.get("/api/admin/certification-review-requests", async (req, res) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const memberships = await storage.getMembershipsByUserId(userId);
      const adminMembership = memberships.filter(
        (m) => ["owner", "admin", "instructor"].includes(String(m.role).toLowerCase())
      ).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      if (!adminMembership) {
        return res.status(403).json({ message: "Admin access required" });
      }
      const requests = await storage.getCertificationReviewRequestsByMakerspaceId(
        adminMembership.makerspaceId
      );
      return res.status(200).json({ requests });
    } catch (error) {
      console.error("Failed to load certification review requests:", error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to load certification review requests"
      });
    }
  });
  app2.post(
    "/api/admin/certification-review-requests/:id/complete",
    async (req, res) => {
      try {
        const userId = req.session?.userId ?? req.user?.id;
        if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        const requestId = req.params.id;
        const request = await storage.getCertificationReviewRequestById(requestId);
        if (!request) {
          return res.status(404).json({ message: "Review request not found" });
        }
        const memberships = await storage.getMembershipsByUserId(userId);
        const adminMembership = memberships.find(
          (m) => m.makerspaceId === request.makerspaceId && ["owner", "admin", "instructor"].includes(
            String(m.role).toLowerCase()
          ) && m.status === "active"
        );
        if (!adminMembership) {
          return res.status(403).json({ message: "Admin access required" });
        }
        const userCertification = await storage.getUserCertificationForReview({
          userId: request.userId,
          certificationModuleId: request.certificationModuleId,
          machineId: request.machineId
        });
        if (!userCertification) {
          return res.status(404).json({
            message: "Matching user certification not found"
          });
        }
        const updatedReview = await storage.updateCertificationReviewRequestStatus(
          requestId,
          "completed"
        );
        const updatedCertification = await storage.updateUserCertificationStatus(
          userCertification.id,
          "active"
        );
        return res.status(200).json({
          reviewRequest: updatedReview,
          certification: updatedCertification
        });
      } catch (error) {
        console.error("Failed to complete certification review:", error);
        return res.status(500).json({
          message: error instanceof Error ? error.message : "Failed to complete certification review"
        });
      }
    }
  );
  app2.post(
    "/api/admin/certification-review-requests/:id/reject",
    async (req, res) => {
      try {
        const userId = req.session?.userId ?? req.user?.id;
        if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        const requestId = req.params.id;
        const request = await storage.getCertificationReviewRequestById(requestId);
        if (!request) {
          return res.status(404).json({ message: "Review request not found" });
        }
        const memberships = await storage.getMembershipsByUserId(userId);
        const adminMembership = memberships.find(
          (m) => m.makerspaceId === request.makerspaceId && ["owner", "admin", "instructor"].includes(
            String(m.role).toLowerCase()
          ) && m.status === "active"
        );
        if (!adminMembership) {
          return res.status(403).json({ message: "Admin access required" });
        }
        const updatedReview = await storage.updateCertificationReviewRequestStatus(
          requestId,
          "rejected"
        );
        const userCertification = await storage.getUserCertificationForReview({
          userId: request.userId,
          certificationModuleId: request.certificationModuleId,
          machineId: request.machineId
        });
        let updatedCertification = null;
        if (userCertification) {
          updatedCertification = await storage.updateUserCertificationStatus(
            userCertification.id,
            "revoked"
          );
        }
        return res.status(200).json({
          reviewRequest: updatedReview,
          certification: updatedCertification
        });
      } catch (error) {
        console.error("Failed to reject certification review:", error);
        return res.status(500).json({
          message: error instanceof Error ? error.message : "Failed to reject certification review"
        });
      }
    }
  );
}

// server/routes/join.ts
function registerJoinRoutes(app2) {
  app2.get("/api/makerspaces/by-slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const makerspace = await storage.getMakerspaceBySlug(slug);
      if (!makerspace) {
        return res.status(404).json({
          message: "Makerspace not found"
        });
      }
      return res.status(200).json({
        makerspace
      });
    } catch (error) {
      console.error("Failed to load makerspace by slug:", error);
      return res.status(500).json({
        message: "Failed to load makerspace"
      });
    }
  });
  app2.post("/api/makerspaces/by-slug/:slug/join", async (req, res) => {
    try {
      const slug = req.params.slug;
      const makerspace = await storage.getMakerspaceBySlug(slug);
      if (!makerspace) {
        return res.status(404).json({
          message: "Makerspace not found"
        });
      }
      const userId = req.session?.userId ?? req.user?.id ?? "member-user";
      let user = await storage.getUserById(userId);
      if (!user) {
        const now = nowIso();
        const fallbackUser = {
          id: userId,
          email: `${userId}@local.dev`,
          fullName: "Member User",
          createdAt: now,
          updatedAt: now
        };
        user = await storage.createUser(fallbackUser);
      }
      const existingMembership = await storage.getMembershipByMakerspaceAndUser(
        makerspace.id,
        userId
      );
      if (existingMembership) {
        return res.status(200).json({
          joined: true,
          alreadyJoined: true,
          makerspace,
          membership: existingMembership
        });
      }
      const membership = {
        id: createId("membership"),
        makerspaceId: makerspace.id,
        userId,
        role: "member",
        status: "active",
        joinedAt: nowIso(),
        createdAt: nowIso()
      };
      const createdMembership = await storage.createMembership(membership);
      return res.status(201).json({
        joined: true,
        alreadyJoined: false,
        makerspace,
        membership: createdMembership
      });
    } catch (error) {
      console.error("Failed to join makerspace:", error);
      return res.status(500).json({
        message: "Failed to join makerspace"
      });
    }
  });
}

// server/routes/member.ts
function getCertificationStatus(args) {
  const { requiresCertification, userCertification } = args;
  if (!requiresCertification) return "not_required";
  if (!userCertification) return "not_certified";
  if (userCertification.status === "pending_review") return "pending_review";
  if (userCertification.status === "expired") {
    return "expired";
  }
  if (userCertification.status === "active") {
    return "certified";
  }
  return "not_certified";
}
function registerMemberRoutes(app2) {
  app2.get("/api/member/makerspace", async (req, res) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const memberships = await storage.getMembershipsByUserId(userId);
      const activeMembership = memberships.find(
        (membership) => membership.role === "member" && membership.status === "active"
      );
      if (!activeMembership) {
        return res.status(404).json({
          message: "No active makerspace membership found"
        });
      }
      const makerspace = await storage.getMakerspaceById(activeMembership.makerspaceId);
      if (!makerspace) {
        return res.status(404).json({
          message: "Makerspace not found"
        });
      }
      const machines = await storage.getMachinesByMakerspaceId(makerspace.id);
      const machineCertifications = await storage.getMachineCertificationsByMakerspaceId(makerspace.id);
      const modules = await storage.getCertificationModulesByMakerspaceId(makerspace.id);
      const userCertifications = await storage.getUserCertificationsByUser(userId);
      const machinesWithStatus = machines.map((machine) => {
        userCertifications.find((cert) => cert.machineId === machine.id) ?? null;
        const machineCert = machineCertifications.find(
          (mc) => mc.machineId === machine.id
        );
        const requiresCertification = machineCert ? machineCert.required : false;
        const certificationProgram = machineCert ? modules.find((m) => m.id === machineCert.certificationModuleId) ?? null : null;
        const userCertification = userCertifications.find((cert) => cert.machineId === machine.id) ?? userCertifications.find(
          (cert) => certificationProgram && cert.certificationModuleId === certificationProgram.id
        ) ?? null;
        return {
          ...machine,
          certificationProgram: certificationProgram ? {
            id: certificationProgram.id,
            title: certificationProgram.title,
            status: certificationProgram.status,
            passingScore: certificationProgram.passingScore,
            estimatedMinutes: certificationProgram.estimatedMinutes,
            updatedAt: certificationProgram.updatedAt
          } : null,
          certificationStatus: getCertificationStatus({
            requiresCertification,
            userCertification
          })
        };
      });
      const earnedCertifications = userCertifications.filter(
        (cert) => ["active", "pending_review"].includes(cert.status)
      ).map((cert) => {
        const machine = machines.find((m) => m.id === cert.machineId);
        const module2 = modules.find((m) => m.id === cert.certificationModuleId);
        return {
          id: cert.id,
          certificationModuleId: cert.certificationModuleId,
          machineId: cert.machineId,
          machineName: machine?.name ?? "Unknown Machine",
          certificationTitle: module2?.title ?? "Certification",
          earnedAt: cert.earnedAt,
          expiresAt: cert.expiresAt ?? null,
          status: cert.status
        };
      });
      return res.status(200).json({
        makerspace,
        machines: machinesWithStatus,
        earnedCertifications
      });
    } catch (error) {
      console.error("Failed to load member makerspace:", error);
      return res.status(500).json({
        message: "Failed to load member makerspace"
      });
    }
  });
  app2.get("/api/member/machines/:machineId", async (req, res) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const machineId = req.params.machineId;
      const machine = await storage.getMachineById(machineId);
      if (!machine) {
        return res.status(404).json({
          message: "Machine not found"
        });
      }
      const machineCertification = await storage.getMachineCertificationByMachineId(machineId);
      let certificationProgram = null;
      if (machineCertification) {
        certificationProgram = await storage.getCertificationModuleById(
          machineCertification.certificationModuleId
        );
      }
      const userCertification = await storage.getUserCertificationForMachine(
        userId,
        machineId
      );
      const requiresCertification = machineCertification ? machineCertification.required : false;
      const certificationStatus = getCertificationStatus({
        requiresCertification,
        userCertification
      });
      const canUseMachine = certificationStatus === "certified" || certificationStatus === "not_required";
      const lockReason = certificationStatus === "pending_review" ? "Pending staff review before machine access." : certificationStatus === "expired" ? "Certification expired. Renewal is required." : certificationStatus === "not_certified" ? "Certification required before machine access." : null;
      return res.status(200).json({
        machine: {
          ...machine,
          requiresCertification
        },
        certificationProgram,
        certificationStatus,
        canUseMachine,
        lockReason
      });
    } catch (error) {
      console.error("Failed to load member machine detail:", error);
      return res.status(500).json({
        message: "Failed to load member machine detail"
      });
    }
  });
  app2.post("/api/member/certifications/:moduleId/complete", async (req, res) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const moduleId = req.params.moduleId;
      const body = req.body;
      const module2 = await storage.getCertificationModuleById(moduleId);
      if (!module2) {
        return res.status(404).json({
          message: "Certification module not found"
        });
      }
      const machineId = module2.machineId ?? null;
      const previousAttempts = await storage.getCertificationAttemptsByUser(userId);
      const attemptNumber = previousAttempts.filter((attempt2) => attempt2.certificationModuleId === moduleId).length + 1;
      const score = Number(body.score ?? 0);
      const passed = !!body.passed;
      const attempt = {
        id: createId("attempt"),
        makerspaceId: module2.makerspaceId,
        userId,
        certificationModuleId: moduleId,
        score,
        passed,
        attemptNumber,
        answersJson: body.answersJson ?? null,
        createdAt: nowIso()
      };
      await storage.createCertificationAttempt(attempt);
      let awardedCertification = null;
      if (passed && machineId) {
        const existingCertification = await storage.getUserCertificationForMachine(
          userId,
          machineId
        );
        if (existingCertification) {
          awardedCertification = await storage.updateUserCertification(
            existingCertification.id,
            {
              status: "pending_review",
              earnedAt: nowIso()
            }
          );
        } else {
          const newCertification = {
            id: createId("usercert"),
            makerspaceId: module2.makerspaceId,
            userId,
            certificationModuleId: moduleId,
            machineId,
            status: "pending_review",
            earnedAt: nowIso(),
            createdAt: nowIso()
          };
          awardedCertification = await storage.createUserCertification(newCertification);
        }
      }
      return res.status(200).json({
        success: true,
        attempt,
        awardedCertification
      });
    } catch (error) {
      console.error("Failed to complete certification:", error);
      return res.status(500).json({
        message: "Failed to complete certification"
      });
    }
  });
  app2.get("/api/member/certifications/:moduleId", async (req, res) => {
    try {
      const moduleId = req.params.moduleId;
      const module2 = await storage.getCertificationModuleById(moduleId);
      if (!module2) {
        return res.status(404).json({ message: "Certification module not found" });
      }
      return res.status(200).json({ module: module2 });
    } catch (error) {
      console.error("Failed to load certification module:", error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to load certification module"
      });
    }
  });
  app2.get("/api/member/review-staff", async (req, res) => {
    const userId = req.session?.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const memberships = await storage.getMembershipsByUserId(userId);
    const memberMembership = memberships.find(
      (m) => m.role === "member" && m.status === "active"
    );
    if (!memberMembership) {
      return res.status(404).json({ message: "No member makerspace found" });
    }
    const staff = await storage.getStaffReviewersByMakerspaceId(
      memberMembership.makerspaceId
    );
    return res.status(200).json({ staff });
  });
  app2.get("/api/member/profile", async (req, res) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const memberships = await storage.getMembershipsByUserId(userId);
      const memberMembership = memberships.filter(
        (m) => String(m.role).toLowerCase() === "member" && m.status === "active"
      ).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      if (!memberMembership) {
        return res.status(404).json({
          message: "No active member makerspace found"
        });
      }
      const makerspace = await storage.getMakerspaceById(
        memberMembership.makerspaceId
      );
      if (!makerspace) {
        return res.status(404).json({ message: "Makerspace not found" });
      }
      const machines = await storage.getMachinesByMakerspaceId(makerspace.id);
      const modules = await storage.getCertificationModulesByMakerspaceId(
        makerspace.id
      );
      const userCertifications = await storage.getUserCertificationsByUser(userId);
      const reviewRequests = await storage.getCertificationReviewRequestsByUser(userId);
      const bookings = await storage.getMachineBookingsByUser(userId);
      const announcements = await storage.getPublishedAnnouncementsByMakerspaceId(makerspace.id);
      const certifications = userCertifications.map((cert) => {
        const machine = machines.find((m) => m.id === cert.machineId);
        const module2 = modules.find(
          (m) => m.id === cert.certificationModuleId
        );
        return {
          id: cert.id,
          certificationModuleId: cert.certificationModuleId,
          certificationTitle: module2?.title ?? "Certification",
          machineId: cert.machineId,
          machineName: machine?.name ?? "Unknown Machine",
          status: cert.status,
          earnedAt: cert.earnedAt,
          expiresAt: cert.expiresAt,
          createdAt: cert.createdAt
        };
      });
      const pendingCertifications = certifications.filter(
        (cert) => cert.status === "pending_review"
      );
      const completedCertifications = certifications.filter(
        (cert) => cert.status === "active"
      );
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl ?? null,
          bio: user.bio ?? "",
          phone: user.phone ?? ""
        },
        makerspace,
        certifications,
        pendingCertifications,
        completedCertifications,
        reviewRequests,
        bookings,
        announcements,
        machines
      });
    } catch (error) {
      console.error("Failed to load member profile:", error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to load member profile"
      });
    }
  });
  app2.patch("/api/member/profile", async (req, res) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const updated = await storage.updateUser(userId, {
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        bio: req.body.bio,
        phone: req.body.phone,
        updatedAt: nowIso()
      });
      return res.status(200).json({ user: updated });
    } catch (error) {
      console.error("Failed to update member profile:", error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to update member profile"
      });
    }
  });
}

// server/routes/knowledge.ts
function registerKnowledgeRoutes(app2) {
  app2.get("/api/member/knowledge", async (req, res) => {
    try {
      const userId = req.user?.id ?? "member-user";
      const memberships = await storage.getMembershipsByUserId(userId);
      const membership = memberships.find((m) => m.status === "active");
      if (!membership) {
        return res.status(404).json({ message: "No makerspace found" });
      }
      const articles = await storage.getKnowledgeArticlesByMakerspace(
        membership.makerspaceId
      );
      return res.json({ articles });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to load knowledge" });
    }
  });
}

// server/routes/auth.routes.ts
function registerAuthRoutes(app2) {
  app2.post("/api/auth/admin-signup", async (req, res) => {
    try {
      const { fullName, email, password, makerspaceName } = req.body;
      if (!fullName || !email || !password || !makerspaceName) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters"
        });
      }
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }
      const now = nowIso();
      const user = await createUserWithPassword({
        email,
        fullName,
        password
      });
      const makerspace = await storage.createMakerspace({
        id: createId("ms"),
        name: makerspaceName,
        slug: makerspaceName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        location: "",
        description: "",
        website: "",
        logoUrl: "",
        createdByUserId: user.id,
        createdAt: now,
        updatedAt: now
      });
      await storage.createMembership({
        id: createId("membership"),
        makerspaceId: makerspace.id,
        userId: user.id,
        role: "owner",
        status: "active",
        joinedAt: now,
        createdAt: now
      });
      req.session.userId = user.id;
      return res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName
        },
        makerspace
      });
    } catch (error) {
      console.error("Admin signup failed:", error);
      return res.status(500).json({
        message: "Admin signup failed"
      });
    }
  });
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, fullName, password } = req.body;
      if (!email || !fullName || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters"
        });
      }
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }
      const user = await createUserWithPassword({
        email,
        fullName,
        password
      });
      req.session.userId = user.id;
      return res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName
        }
      });
    } catch (error) {
      console.error("Signup failed:", error);
      return res.status(500).json({ message: "Signup failed" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user?.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      req.session.userId = user.id;
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName
        }
      });
    } catch (error) {
      console.error("Login failed:", error);
      return res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ loggedOut: true });
    });
  });
  app2.get("/api/auth/me", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(200).json({
          user: null,
          memberships: [],
          adminMakerspace: null,
          memberMakerspace: null
        });
      }
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      const memberships = await storage.getMembershipsByUserId(userId);
      const adminMembership = memberships.filter(
        (m) => ["owner", "admin", "instructor"].includes(
          String(m.role).toLowerCase()
        )
      ).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      const adminMakerspace = adminMembership ? await storage.getMakerspaceById(adminMembership.makerspaceId) : null;
      const memberMembership = memberships.filter(
        (m) => String(m.role).toLowerCase() === "member" && m.status === "active"
      ).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      const memberMakerspace = memberMembership ? await storage.getMakerspaceById(memberMembership.makerspaceId) : null;
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName
        },
        memberships,
        adminMakerspace,
        memberMakerspace
      });
    } catch (error) {
      console.error("Failed to load current user:", error);
      return res.status(500).json({
        message: "Failed to load user"
      });
    }
  });
  app2.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({
          message: "Failed to logout"
        });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({
        success: true
      });
    });
  });
  app2.get("/api/makerspaces/discover", async (_req, res) => {
    console.log("HIT /api/makerspaces/discover");
    try {
      const makerspaces = await storage.getPublicMakerspacesForDirectory();
      return res.status(200).json({ makerspaces });
    } catch (error) {
      console.error("Failed to load makerspace directory:", error);
      console.log(
        "ACTIVE POSTGRES HOST:",
        new URL(process.env.POSTGRES_URL).hostname
      );
      return res.status(500).json({
        message: "Failed to load makerspace directory"
      });
    }
  });
}

// server/routes/cert-scheduel.ts
function registerScheduleCertificationRoutes(app2) {
  app2.post("/api/member/certification-review-requests", async (req, res) => {
    const userId = req.session?.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {
      certificationModuleId,
      machineId,
      staffUserId,
      requestedDate,
      requestedTime,
      notes
    } = req.body;
    if (!certificationModuleId || !requestedDate || !requestedTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const memberships = await storage.getMembershipsByUserId(userId);
    const memberMembership = memberships.find(
      (m) => m.role === "member" && m.status === "active"
    );
    if (!memberMembership) {
      return res.status(404).json({ message: "No member makerspace found" });
    }
    const request = await storage.createCertificationReviewRequest({
      id: createId("reviewreq"),
      makerspaceId: memberMembership.makerspaceId,
      userId,
      certificationModuleId,
      machineId: machineId ?? null,
      staffUserId: staffUserId ?? null,
      requestedDate,
      requestedTime,
      notes: notes ?? "",
      status: "pending",
      createdAt: nowIso(),
      updatedAt: nowIso()
    });
    return res.status(201).json({ request });
  });
}

// server/routes.ts
function registerRoutes(app2) {
  registerAdminOnboardingRoutes(app2);
  registerAdminMakerspaceRoutes(app2);
  registerMachineRoutes(app2);
  registerMachineCertificationRoutes(app2);
  registerJoinRoutes(app2);
  registerMemberRoutes(app2);
  registerKnowledgeRoutes(app2);
  registerAuthRoutes(app2);
  registerScheduleCertificationRoutes(app2);
  app2.get("/api/users", async (_req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });
  app2.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
}

// server/app.ts
var app = (0, import_express.default)();
app.use(
  import_express.default.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(import_express.default.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      console.log(
        `${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`
      );
    }
  });
  next();
});
setupAuth(app);
registerRoutes(app);
app.use(
  (err, _req, res, next) => {
    console.error("Internal Server Error:", err);
    if (res.headersSent) {
      return next(err);
    }
    return res.status(err.status || err.statusCode || 500).json({
      message: err.message || "Internal Server Error"
    });
  }
);
var app_default = app;
