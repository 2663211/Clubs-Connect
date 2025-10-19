---
title: Database Documentation
description: This is documentation about the database and how its designed for the Clubs Connect Application
---

## Entity Relationship Diagram

<iframe frameborder="0" style="width:100%;height:1018px;" src="https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=ERD.drawio&dark=auto#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1I73fH0nydh9PyuSEcE6zIONhIsnP7_UX%26export%3Ddownload"></iframe>

## Relationships

- A user may be an SGO officer, but an SGO officer must be a user.
- A user can follow or be a member of many CSOs, and a CSO can have many followers/members.
- A user can hold multiple executive positions (across different CSOs or at different times), but an executive must be a user.
- A CSO has multiple executives, and an executive belongs to one CSO.
- A CSO can have many posts, and each post belongs to one CSO.
- An executive can create many posts, but each post is created by one executive at a time.
- A user can create many posts, but each post must be linked to one user profile (not in the diagram to keep it neat).
- A post can have many comments, but each comment belongs to one post.
- A user can write many comments, but each comment must be written by one user.
- An SGO officer can create many announcements, but each announcement is created by one SGO officer.
- An announcement may contain media, but media must belong to one announcement.
- An executive can create many events, but each event is created by one executive.

## Database Schema (SQL)

> **⚠️ WARNING:**  
> This schema is for context only and is **not meant to be run**.  
> Table order and constraints may not be valid for execution.

```sql
CREATE TABLE public.Comments (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  post_id uuid DEFAULT gen_random_uuid(),
  student_number uuid DEFAULT gen_random_uuid(),
  comment text,
  liked boolean DEFAULT false,
  CONSTRAINT Comments_pkey PRIMARY KEY (id),
  CONSTRAINT Comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id),
  CONSTRAINT comments_student_number_fkey FOREIGN KEY (student_number) REFERENCES public.profiles(id)
);

CREATE TABLE public.announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  media_url text,
  media_type text,
  caption text,
  user_id uuid DEFAULT auth.uid(),
  CONSTRAINT announcements_pkey PRIMARY KEY (id),
  CONSTRAINT announcements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE public.cso (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  logo_url text,
  name text,
  cluster text,
  subscription text,
  description text,
  CONSTRAINT cso_pkey PRIMARY KEY (id)
);

CREATE TABLE public.cso_exec (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  start_date date,
  end_date date,
  portfolio text,
  can_post boolean,
  cso_id uuid DEFAULT gen_random_uuid(),
  exec_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT cso_exec_pkey PRIMARY KEY (id),
  CONSTRAINT cso_exec_cso_id_fkey FOREIGN KEY (cso_id) REFERENCES public.cso(id),
  CONSTRAINT cso_exec_exec_id_fkey FOREIGN KEY (exec_id) REFERENCES public.executive(id)
);

CREATE TABLE public.cso_follow (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  cso_id uuid DEFAULT gen_random_uuid(),
  student_number uuid DEFAULT gen_random_uuid(),
  follow_status boolean,
  CONSTRAINT cso_follow_pkey PRIMARY KEY (id),
  CONSTRAINT cso_follow_student_number_fkey FOREIGN KEY (student_number) REFERENCES public.profiles(id),
  CONSTRAINT cso_follow_cso_id_fkey FOREIGN KEY (cso_id) REFERENCES public.cso(id)
);

CREATE TABLE public.cso_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  cso_id uuid DEFAULT gen_random_uuid(),
  student_number uuid DEFAULT gen_random_uuid(),
  CONSTRAINT cso_members_pkey PRIMARY KEY (id),
  CONSTRAINT cso_members_cso_id_fkey FOREIGN KEY (cso_id) REFERENCES public.cso(id),
  CONSTRAINT cso_members_student_number_fkey FOREIGN KEY (student_number) REFERENCES public.profiles(id)
);

CREATE TABLE public.events (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  description text,
  date timestamp with time zone NOT NULL,
  location text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  exec_id uuid,
  poster_image text,
  category text,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_exec_id_fkey FOREIGN KEY (exec_id) REFERENCES public.executive(id)
);

CREATE TABLE public.executive (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  student_number uuid DEFAULT gen_random_uuid() UNIQUE,
  CONSTRAINT executive_pkey PRIMARY KEY (id),
  CONSTRAINT executive_student_number_fkey FOREIGN KEY (student_number) REFERENCES public.profiles(id)
);

CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  media_url text,
  media_type text,
  caption text,
  cso_id uuid DEFAULT gen_random_uuid(),
  member_only boolean DEFAULT false,
  like_count integer DEFAULT 0,
  user_id uuid DEFAULT auth.uid(),
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_cso_id_fkey FOREIGN KEY (cso_id) REFERENCES public.cso(id),
  CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  role text DEFAULT 'student'::text CHECK (role = ANY (ARRAY['student'::text, 'sgo'::text, 'exec'::text])),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  icam_number text,
  contact_number text,
  faculty text,
  avatar_url text,
  bio text,
  cover_url text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE public.sgo (
  sgo_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  office_no text,
  position text,
  building text,
  floor text,
  CONSTRAINT sgo_pkey PRIMARY KEY (sgo_id),
  CONSTRAINT sgo_sgo_id_fkey FOREIGN KEY (sgo_id) REFERENCES public.profiles(id)
);
```

## Indexes

Supabase automatically creates indexes on **primary key** columns for fast lookup. In our database:

- `id` columns in tables such as `Comments`, `Posts`, `CSO`, `Events`, and `Executive` are primary keys and indexed automatically.
- Foreign key columns like `post_id` in `Comments` and `cso_id` in `Posts` are also indexed to optimize joins and queries.

**Purpose:**  
Indexes improve query performance when filtering, sorting, or joining tables.

## Stored Procedures & Triggers

Currently, our setup does not include custom stored procedures or triggers.

- Most application logic is handled in the frontend and backend via Supabase API calls.
- Future enhancements could use triggers for automatic updates, e.g., incrementing `like_count` when a comment is liked.

**Reference:** [Supabase Functions & Triggers](https://supabase.com/docs/guides/database/postgres/triggers)

## Data Flow / Usage

The database supports full CRUD (Create, Read, Update, Delete) operations through Supabase API:

- **Create:** New users, posts, events, and comments are added via Supabase `insert()` calls.
- **Read:** Data is retrieved using `select()` queries to display content in the application.
- **Update:** Existing records (e.g., posts, profile information) are updated via `update()` queries.
- **Delete:** Records can be removed using `delete()` calls when necessary.

**Interaction:**

- Frontend React components communicate with the database through Supabase API.
- Relationships between tables (foreign keys) ensure data consistency across users, CSOs, posts, and events.

## Constraints and Rules

- **Primary Key Constraints:** Ensure each record has a unique identifier.
- **Foreign Key Constraints:** Maintain relational integrity, e.g., comments must belong to a valid post and student.
- **Check Constraints:** Enforce valid values, e.g., `role` in `profiles` is restricted to `student`, `exec`, or `sgo`.
- **Default Values:** Automatically populate columns like `created_at` with timestamps for consistency.

## Sample Data

Example entries for testing and illustration:

```sql
-- Example Post
INSERT INTO posts (id, caption, cso_id, user_id)
VALUES ('uuid-123', 'Welcome to the club!', 'cso-uuid-1', 'user-uuid-1');

-- Example Event
INSERT INTO events (title, description, date, location, exec_id)
VALUES ('Tech Talk', 'Introduction to Web Development', '2025-10-25 18:00', 'Room 101', 'exec-uuid-1');
```

## Backup & Restore

Backup: Supabase provides automatic daily backups. Manual backups can also be performed through the dashboard or CLI.

Restore: Databases can be restored to any available point in time.

**Reference:** [Supabase Functions & Triggers](https://supabase.com/docs/guides/platform/backups)
