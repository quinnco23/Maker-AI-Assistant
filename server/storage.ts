import { sql } from "./db/client.js";
import type {
  AdminMakerspaceView,
  CertificationAttemptRecord,
  CertificationModuleRecord,
  KnowledgeArticleRecord,
  MachineCertificationRecord,
  MachineRecord,
  MakerspaceInviteRecord,
  MakerspaceMembershipRecord,
  MakerspaceRecord,
  UserCertificationRecord,
  UserRecord,
  
} from "./db/schema.js";

import { nowIso } from "./db/schema";



export const storage = {
  async getUsers(): Promise<UserRecord[]> {
    const rows = await sql<UserRecord[]>`
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

  async getUserById(userId: string): Promise<UserRecord | null> {
    const rows = await sql<UserRecord[]>`
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

  async updateUser(
    userId: string,
    updates: Partial<UserRecord>,
  ): Promise<UserRecord | null> {
    const existing = await this.getUserById(userId);
    if (!existing) return null;
  
    const next = {
      ...existing,
      ...updates,
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

  async createMakerspace(makerspace: MakerspaceRecord): Promise<MakerspaceRecord> {
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

  async getMakerspaceById(makerspaceId: string): Promise<MakerspaceRecord | null> {
    const rows = await sql<MakerspaceRecord[]>`
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

  async getMakerspaceBySlug(slug: string): Promise<MakerspaceRecord | null> {
    const rows = await sql<MakerspaceRecord[]>`
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

  async getMakerspaceByCreatedByUserId(userId: string): Promise<MakerspaceRecord | null> {
    const rows = await sql<MakerspaceRecord[]>`
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

  async listMakerspaces(): Promise<MakerspaceRecord[]> {
    const rows = await sql<MakerspaceRecord[]>`
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

  async updateMakerspace(
    makerspaceId: string,
    updates: Partial<MakerspaceRecord>,
  ): Promise<MakerspaceRecord | null> {
    const existing = await this.getMakerspaceById(makerspaceId);
    if (!existing) return null;

    const next = {
      ...existing,
      ...updates,
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

  async createMembership(
    membership: MakerspaceMembershipRecord,
  ): Promise<MakerspaceMembershipRecord> {
    const existing = await this.getMembershipByMakerspaceAndUser(
      membership.makerspaceId,
      membership.userId,
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

  async getMembershipById(
    membershipId: string,
  ): Promise<MakerspaceMembershipRecord | null> {
    const rows = await sql<MakerspaceMembershipRecord[]>`
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

  async getMembershipByMakerspaceAndUser(
    makerspaceId: string,
    userId: string,
  ): Promise<MakerspaceMembershipRecord | null> {
    const rows = await sql<MakerspaceMembershipRecord[]>`
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

  async getMembershipsByMakerspaceId(
    makerspaceId: string,
  ): Promise<MakerspaceMembershipRecord[]> {
    const rows = await sql<MakerspaceMembershipRecord[]>`
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

  async getMembershipsByUserId(userId: string): Promise<MakerspaceMembershipRecord[]> {
    const rows = await sql<MakerspaceMembershipRecord[]>`
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

  async updateMembership(
    membershipId: string,
    updates: Partial<MakerspaceMembershipRecord>,
  ): Promise<MakerspaceMembershipRecord | null> {
    const existing = await this.getMembershipById(membershipId);
    if (!existing) return null;

    const next = {
      ...existing,
      ...updates,
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

  async createInvite(invite: MakerspaceInviteRecord): Promise<MakerspaceInviteRecord> {
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

  async getInviteByToken(token: string): Promise<MakerspaceInviteRecord | null> {
    const rows = await sql<MakerspaceInviteRecord[]>`
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

  async getInvitesByMakerspaceId(
    makerspaceId: string,
  ): Promise<MakerspaceInviteRecord[]> {
    const rows = await sql<MakerspaceInviteRecord[]>`
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

  async updateInvite(
    inviteId: string,
    updates: Partial<MakerspaceInviteRecord>,
  ): Promise<MakerspaceInviteRecord | null> {
    const existing = await sql<MakerspaceInviteRecord[]>`
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

  async createMachine(machine: MachineRecord): Promise<MachineRecord> {
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

  async getMachineById(machineId: string): Promise<MachineRecord | null> {
    const rows = await sql<MachineRecord[]>`
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

  async getMachinesByMakerspaceId(makerspaceId: string): Promise<MachineRecord[]> {
    const rows = await sql<MachineRecord[]>`
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

  async updateMachine(
    machineId: string,
    updates: Partial<MachineRecord>,
  ): Promise<MachineRecord | null> {
    const existing = await this.getMachineById(machineId);
    if (!existing) return null;

    const next = {
      ...existing,
      ...updates,
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

  async deleteMachine(machineId: string): Promise<boolean> {
    const result = await sql`
      delete from machines
      where id = ${machineId}
    `;
    return result.count > 0;
  },

  async createCertificationModule(
    module: CertificationModuleRecord,
  ): Promise<CertificationModuleRecord> {
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
        ${module.id},
        ${module.makerspaceId},
        ${module.machineId ?? null},
        ${module.title},
        ${module.description ?? null},
        ${module.version ?? null},
        ${module.sourceType ?? null},
        ${module.sourceTemplateId ?? null},
        ${module.status ?? null},
        ${module.contentJson ?? null},
        ${module.estimatedMinutes ?? null},
        ${module.passingScore ?? null},
        ${module.expiresInDays ?? null},
        ${module.isRequired ?? null},
        ${module.isPublished},
        ${module.createdAt},
        ${module.updatedAt}
      )
    `;
    return module;
  },

  async getCertificationModuleById(
    moduleId: string,
  ): Promise<CertificationModuleRecord | null> {
    const rows = await sql<CertificationModuleRecord[]>`
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

  async getCertificationModulesByMakerspaceId(
    makerspaceId: string,
  ): Promise<CertificationModuleRecord[]> {
    const rows = await sql<CertificationModuleRecord[]>`
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

  async updateCertificationModule(
    moduleId: string,
    updates: Partial<CertificationModuleRecord>,
  ): Promise<CertificationModuleRecord | null> {
    const existing = await this.getCertificationModuleById(moduleId);
    if (!existing) return null;

    const next = {
      ...existing,
      ...updates,
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
        content_json = ${next.contentJson ?? null},
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

  async createMachineCertification(
    machineCertification: MachineCertificationRecord,
  ): Promise<MachineCertificationRecord> {
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

  async getMachineCertificationByMachineId(
    machineId: string,
  ): Promise<MachineCertificationRecord | null> {
    const rows = await sql<MachineCertificationRecord[]>`
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

  async createCertificationAttempt(
    attempt: CertificationAttemptRecord,
  ): Promise<CertificationAttemptRecord> {
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

  async getCertificationAttemptsByUser(
    userId: string,
  ): Promise<CertificationAttemptRecord[]> {
    const rows = await sql<CertificationAttemptRecord[]>`
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

  async createUserCertification(
    userCertification: UserCertificationRecord,
  ): Promise<UserCertificationRecord> {
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

  async updateUserCertification(
    certificationId: string,
    updates: Partial<UserCertificationRecord>,
  ): Promise<UserCertificationRecord | null> {
    const rows = await sql<UserCertificationRecord[]>`
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
      ...updates,
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

  async getUserCertificationsByUser(
    userId: string,
  ): Promise<UserCertificationRecord[]> {
    const rows = await sql<UserCertificationRecord[]>`
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

  async getUserCertificationForMachine(
    userId: string,
    machineId: string,
  ): Promise<UserCertificationRecord | null> {
    const rows = await sql<UserCertificationRecord[]>`
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

  async getKnowledgeArticlesByMakerspace(
    makerspaceId: string,
  ): Promise<KnowledgeArticleRecord[]> {
    const rows = await sql<KnowledgeArticleRecord[]>`
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

  async getAdminMakerspaceByUserId(
    userId: string,
  ): Promise<AdminMakerspaceView | null> {
    const membershipRows = await sql<MakerspaceMembershipRecord[]>`
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

    const members = await sql<
      Array<{
        id: string;
        userId: string;
        fullName: string;
        email: string;
        role: string;
        status: string;
        joinedAt?: string;
      }>
    >`
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
      members,
    };
  },
  async getMachineCertificationsByMakerspaceId(makerspaceId: string) {
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

  async getMachineCertificationById(machineCertificationId: string) {
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

  

  async updateMachineCertification(
    machineCertificationId: string,
    updates: { required?: boolean },
  ) {
    await sql`
      update machine_certifications
      set
        required = ${updates.required}
      where id = ${machineCertificationId}
    `;
  
    return {
      id: machineCertificationId,
      ...updates,
    };
  },

  async getPendingCertificationApprovals(makerspaceId: string) {
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
  
  async updateUserCertificationStatus(
    certificationId: string,
    status: "pending_review" | "active" | "expired" | "revoked",
  ) {
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


  async getUserByEmail(email: string) {
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

  async createUser(user: any) {
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
  async markMakerspaceOnboardingComplete(makerspaceId: string) {
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
  async createCertificationReviewRequest(request: any) {
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
  async getCertificationReviewRequestsByMakerspaceId(makerspaceId: string) {
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

  async getCertificationReviewRequestById(requestId: string) {
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
  
  async updateCertificationReviewRequestStatus(
    requestId: string,
    status: "pending" | "scheduled" | "completed" | "rejected",
  ) {
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

  async getUserCertificationForReview(args: {
    userId: string;
    certificationModuleId: string;
    machineId?: string | null;
  }) {
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

  async getStaffReviewersByMakerspaceId(makerspaceId: string) {
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
  
  async getCertificationReviewRequestsByUser(userId: string) {
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
  
  async getMachineBookingsByUser(userId: string) {
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
  
  async getPublishedAnnouncementsByMakerspaceId(makerspaceId: string) {
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
  },
};

