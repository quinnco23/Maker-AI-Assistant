type User = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: "member" | "admin" | "owner";
    createdAt: string;
  };


  type Makerspace = {
    id: string;
    ownerUserId: string;
    name: string;
    slug: string;
    location: string;
    description: string;
    website?: string;
    logoUrl?: string;
    createdAt: string;
    updatedAt: string;
  };

  type MakerspaceStaff = {
    id: string;
    makerspaceId: string;
    userId: string;
    role: "owner" | "admin" | "instructor";
    createdAt: string;
  };


  type MakerspaceStaff = {
    id: string;
    makerspaceId: string;
    userId: string;
    role: "owner" | "admin" | "instructor";
    createdAt: string;
  };


  type MachineCertification = {
    id: string;
    machineId: string;
    certificationModuleId: string;
    required: boolean;
    createdAt: string;
  };

  type PublishOnboardingRequest = {
    makerspace: {
      name: string;
      slug: string;
      location: string;
      description: string;
      website?: string;
    };
    machine: {
      name: string;
      type: string;
      brand?: string;
      model?: string;
      locationLabel: string;
      description: string;
      requiresCertification: boolean;
    };
    certification?: {
      mode: "template" | "duplicate" | "custom" | "none";
      templateId?: string;
      title?: string;
      estimatedMinutes?: number;
      passingScore?: number;
    };
  };

  