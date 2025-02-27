import { JsonObject } from "next-auth/adapters";

export type User = {
    id: number;
    name: string;
    email: string;
    username: string;
    image: string | null;
    experience: string | null;
    wallet_address: string | null;
    social_links: JsonObject | null; // Assuming JSON format or stringified data
    skills: string | null;
    location: string | null;
    bio: string | null;
    first_provider: string | null;
    email_verified: Date | null;
    created_at: Date;
    updated_at: Date;
    work_preference: string | null;
    current_employment: string | null;
    communities: string | null;
    interested_in: string | null;
  };

  export interface partner {
    id: number;
    username: string;
    creator_id: number;
    name: string;
    email: string;
    location?: string | null;
    bio?: string | null; // Optional field (nullable in the database)
    profile_photo_url?: string | null; // Optional field (nullable in the database)
    social_links?: JsonObject | null; // Assumes JSON string for social links
    members_usernames?: string | null; // Assumes JSON string or comma-separated list of usernames
    industry_name?: string | null; // Optional field
    is_verified?: boolean; // Represents tinyint, where 1 = true, 0 = false
    description?: string | null; // Optional field (nullable in the database)
    created_at?: Date; // Optional since it defaults to the current timestamp
  }
  