import { sql } from "./db/client";
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
} from "./db/schema";

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
        created_at as "createdAt",
        updated_at as "updatedAt"
      from users
      where id = ${userId}
      limit 1
    `;
    return rows[0] ?? null;
  },

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const rows = await sql<UserRecord[]>`
      select
        id,
        email,
        full_name as "fullName",
        avatar_url as "avatarUrl",
        created_at as "createdAt",
        updated_at as "updatedAt"
      from users
      where lower(email) = lower(${email})
      limit 1
    `;
    return rows[0] ?? null;
  },

  async createUser(user: UserRecord): Promise<UserRecord> {
    await sql`
      insert into users (
        id,
        email,
        full_name,
        avatar_url,
        created_at,
        updated_at
      ) values (
        ${user.id},
        ${user.email},
        ${user.fullName},
        ${user.avatarUrl ?? null},
        ${user.createdAt},
        ${user.updatedAt}
      )
    `;
    return user;
  },

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
};