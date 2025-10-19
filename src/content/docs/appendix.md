---
title: Appendix
description: This is where the evidence of the scrum methodology is.
---

## Project Proposal

1. What is the name of your project?<br>
   Clubs Connect (Sample name)
2. Give a brief description of the project.<br>
   Clubs Connect is a web application designed to bring together various university structures such as clubs, societies, university offices, and councils for the holistic benefit of students. It allows students to interact with these structures, learn about what they do, see upcoming events, and discover how to get involved.

   The platform also encourages collaboration between clubs and societies for events and campaigns, offers tips for attracting new members, and connects them with companies or partners who can fund or support their activities. It’s a space to encourage partnership, visibility, and unity across the university community.

3. Provide a feature description of the project.<br>
   The platform includes the following key features:

   - Entity Pages: Each society, office, council, or company gets a dedicated page with info like name, logo, what they do, contact details, posts, events, exec team members, etc. Think of it like a mini website.
   - Page Admin and Contributors: An exec member can create the entity page and invite others from their team to contribute. The creator becomes the admin and can transfer ownership as teams change annually.
   - Messaging System:
     Personal messages between students and exec members.
     Group chats for society members.
     Optional communal messaging boards for finding collaborators, asking questions, or networking.
   - Membership Control:
     Users can follow or sign up for societies.
     Some content (like polls, internal announcements) can be restricted to signed-up members only.
   - Calendar Integration: Students can track events, volunteering opportunities, or anything they’re attending through an integrated calendar view.
   - Polls & Forms: Entity pages can include polls, newsletters, feedback forms, and even elections (for student councils).
   - Event & Notification Posts: Societies and offices can post updates, event info, and notifications. Users who follow or are members will get these updates.
   - Collaboration Requests: Clubs can reach out to each other or companies for partnerships or sponsorships through formal request features.
   - SGO Oversight:
     SGO can post admin notices, send invitations, and manage societies directly on the platform.
     Could also help verify page creators using Wits emails and internal society membership data.
   - Companies & Sponsors: Can create a profile, find societies to partner with, and be visible to relevant execs. <br>

4. Provide a list of API modules your project will provide.

   - Authentication API - (student login, exec verification using Wits emails)
   - Messaging API - (personal and group messaging features)
   - Posts & Feed API - (for handling page updates, notices, polls, etc.)
   - Membership & Follower Management API - (joining/following a society)
   - Collaboration Request API - (between clubs or with companies)
   - Notification API - (for alerting users of new posts, events, messages)
   - Calendar Events API - (add/view/manage event participation)
   - Admin Tools API - (SGO tools for managing societies, exec roles, invitations) \

5. Provide a list of UI pages your project will require.

   - Homepage - (Intro to Clubs Connect, search bar, featured societies/offices)
   - Login/Signup Page
   - Dashboard - (based on role: student, exec, SGO, company)
   - Entity Profile Page - (for clubs, societies, councils, offices, companies)
   - Messaging Interface - (personal and group chats)
   - Event Calendar Page - (personalised for the user)
   - Collaboration Requests Page - (sent/received requests)
   - Polls & Forms Interface - (to participate or create)
   - Notifications Page
   - SGO Admin Panel (to manage societies, verify users, send notices)

6. Provide a list of database components your project requires.

   - User Table
   - Entity Table
   - Posts Table
   - Events Table
   - Messages Table
   - Membership Table
   - Collaboration Requests Table
   - Polls & Feedback Forms Table
   - Notifications Table

7. Provide a potential use case of an external API.

   - Google Calendar API: To sync and display upcoming events or volunteering activities for each student.
   - Messaging API (like Twilio Conversations or Stream Chat): To enable real-time messaging between users and groups.
   - Google Maps API: To show directions to event venues or office locations inside/outside campus.

_An exec member is someone who is part of the entity leadership team_ <br>
_An entity is referring either a society, a club, a council, wits office_

## Meeting Minutes

MEETING DETAILS <br>
**Date:** 25 August 2025 <br>
**Time:** 17:30 - 18:00 <br>
**Venue:** Online (Zoom) <br>
**Attendees:** Vusani Radzilani (Client), Busisiwe Mnisi, Theto Maunatlala, Mmakwena Moichela, Paballo Molaontoa, Mukondi Ramabulana <br>
**Absent:** None <br>

AGENDA

1. Opening and welcome
2. Progress on/of work
3. Features to be implemented in Sprint 2
4. Wireframes feedback

MINUTES <br>

**Discussion points:**<br>
Opening and welcome:

- Everyone is available and present

Progress on/of work:

- Nothing much has been done so far
- There is progress with the wireframes with different views for different roles

Features to be implemented in Sprint 2:

- Create our own API - important.
- We need to host the application - don't have to run it locally.
- Need features that work, Sprint 1 was based largely on documentation.
- Extend roles to be more meaningful - different users with different roles should be able to do role based activities. Should be able to approve or deny requests to join society. ROLES NEED TO BE SOLIDIFIED!
- Testing needs to be there, automated testing should go without saying.
- Follow methodology Scrumban - must have evidence of meetings
- Clubs module must be implemented - translates to the roles and permissions

Wireframes feedback:

- Create posts from the page of the CSO instead of creating post from profile
- Have different privileges as an exec but be able to have same
- The CSO form, aka the entity, have a feature where you type in the student number and the student appears

**Decisions made:**
None

**Action items:**<br>
_Action item - Person Responsible - Due Date_ <br>

1. SGO role activities, edit ERD - Busisiwe Mnisi - 27/08/25,<br>
2. SGO role activities - Paballo Molaontoa - 27/08/25,<br>
3. Posts by CSOs - Theto Maunatlala - 27/08/25,<br>
4. Research testing - Mukondi Ramabulana - 27/08/25,<br>
5. Editing UIs and add new ones - Mmakwena Moichela - 27/08/25,<br>

CLOSURE<br>
The meeting was adjourned at 18:25. The next meeting will be held on 27/08/25 at 19:00 on Discord

ADDITIONAL NOTES<br>
None

![Meeting Minutes](/Clubs-Connect/M1.png "Meeting")

---

MEETING DETAILS<br>
**Date:** 27 August 2025<br>
**Time:** 19:00 - 19: 30<br>
**Venue:** Online (Discord)<br>
**Attendees:** Busisiwe Mnisi, Theto Maunatlala, Mmakwena Moichela, Mukondi Ramabulana<br>
**Absent:** Paballo Molaontoa<br>

AGENDA

1. Opening and welcome
2. Progress on/of work

MINUTES<br>

**Discussion points:**

Opening and welcome:

- Everyone is doing well

Progress on/of work:

- Problems with the linter, it seems to be breaking things
- Also cloning the app seems to be giving some team members problems, they are struggling to run the app and make it work.
- UI wireframes is done, homepage if fixed as per feedback from client

**Decisions made:**

- Duplicate Mukondi branch and make it main, it will serve as a base code where we will add features.
- Deploy the application as version 1 for the the working features - Busisiwe will do it.
- Ignore the linter for now and focus on making the application work and having more features.

**Action items:**<br>
_Action item - Person Responsible - Due Date_<br>

1. Create CSOs and pages - Busisiwe Mnisi - 1 September 2025,<br>
2. Continue with SFO features - Paballo Molaontoa - 1 September 2025,<br>
3. Get started on the API, implement features - Theto Maunatlala - 1 September 2025,<br>
4. Configuring Jest to work on GitHub Actions, implement exec features - Mukondi Ramabulana - 1 September 2025,<br>
5. Implement student profile - Mmakwena Moichela - 1 September 2025,<br>

CLOSURE<br>
The meeting was adjourned at 19:30. The next meeting will be held on 1 September 2025 at 1415 at MSL Labs

ADDITIONAL NOTES<br>
None

![Meeting Minutes](/Clubs-Connect/M2.png "Meeting")

---

MEETING DETAILS<br>
**Date:** 01 September 2025<br>
**Time:** 14:15 - 15:00<br>
**Venue:** MSL Labs<br>
**Attendees:** Busisiwe Mnisi, Theto Maunatlala, Mmakwena Moichela, Mukondi Ramabulana, Paballo Molaontoa<br>
**Absent:** None<br>

AGENDA

1. Opening and welcome
2. Progress on/of work
3. Current working features
4. Features in progress

MINUTES<br>

**Discussion points:**

Opening and welcome:

- Everyone is doing well

Progress on/of work:

- There is a problem with sign up so we have to start a new Supabase project.
- The focus is on getting the app working for submission, the following is the stas of the project.

Current working features:

- UI Test
- Exec can post
- API - needs to be deployed and tested

Features in progress:

- API Testing
- User feedback

**Decisions made:**

- Finalize application for submission

**Action items:**
_Action item - Person Responsible - Due Date_

1. Add to documentation - Busisiwe Mnisi - 2 September 2025,
2. Get user feedback, and migrate Supabase to a new project - Paballo Molaontoa - 2 September 2025,
3. Test API and deploy it - Theto Maunatlala - 2 September 2025,
4. Write tests for CSO pages and posting features - Mukondi Ramabulana - 2 September 2025,
5. Deploy, and write some tests - Mmakwena Moichela - 2 September 2025,

CLOSURE<br>
The meeting was adjourned at 15:30. The next meeting will be held on 2 September 2025 at 19:00 online

ADDITIONAL NOTES<br>
None

---

MEETING DETAILS<br>
**Date:** 03 September 2025<br>
**Time:** 19:00 - 20:15<br>
**Venue:** Teams (Online)<br>
**Attendees:** Busisiwe Mnisi, Theto Maunatlala, Mmakwena Moichela, Mukondi Ramabulana, Paballo Molaontoa, Vusani Radzilani (Client)<br>
**Absent:** None<br>

AGENDA<br>

1. Opening and welcome<br>
2. Feedback from client<br>

MINUTES<br>

**Discussion points:**

Opening and welcome:

- Everyone is doing well

Feedback from client:

- Document APIs used, for the 3rd part code
- Need to get more feedback, ask more people
- Make use of GitHub issues to keep track of bugs, if there is one - open an issue and then close it when
- Every piece of code you did not create you must put it in 3rd party documentation -
- Put testing guide under testing
- Must be able to derive a feedback form the form from users and document the discussion and evaluation.
- Start working with the requirements that were discussed in the last sprint.

**Decisions made:**

- Communicate later today or tomorrow for meeting for the Sprint Planning.
- Meet 2 hours before the meeting with the client

**Action items:**<br>
_Action item - Person Responsible - Due Date_<br>
Team to resume work at the beginning of Sprint 3.

CLOSURE<br>
The meeting was adjourned at 15:30. The next meeting will be the Sprint planning meeting held on 4 September 2025 at 19:00 or later.

ADDITIONAL NOTES<br>
None

![Meeting Minutes](/Clubs-Connect/M4a.png "Meeting")
![Meeting Minutes](/Clubs-Connect/M4b.png "Meeting")
![Meeting Minutes](/Clubs-Connect/M4c.png "Meeting")

---

MEETING DETAILS<br>
**Date:** 04 September 2025<br>
**Time:** 17:30 - 19:00<br>
**Venue:** Teams (Online)<br>
**Attendees:** Busisiwe Mnisi, Theto Maunatlala, Mmakwena Moichela, Mukondi Ramabulana, Paballo Molaontoa<br>
**Absent:** None<br>

AGENDA<br>

1. Opening and welcome<br>
2. Features left to be implemented per role<br>

MINUTES<br>

**Discussion points:**

Opening and welcome:

- Everyone is doing well

Features left to be implemented per role:<br>

**Student:**

- Add functionality of selecting interests, so that on the news feed the students see posts from CSOs that they are interested in - put it underneath the Groups Joined
- The news feed will show recent posts from CSOs, and when you click on the CSO, then you can see all their post
- Comments: extra feat at the moment, still have to check and API for it, storing it on Supabase will be hard.
- Implement searching for clubs
- Chat - has all the group chats that the student is a member of
- Events tab for everyone, events that appear there are based on member or follower
- When they click on Groups Joined they go to the pages of the CSOs
- Preferably: Have a buttons that takes one to WhatsApp instead of chat inside the application

**Executives:**

- Execs are members by definition
- Execs can make new events - can delete and update
- Execs have the same profile as students, the difference will be when they click on the CSO, they will have additional functionality
- Execs are students with additional functionality, so we don't need a different dashboard

**SGO:**

- Have SGO change roles to member or follower
- Remove the executive roles in the profiles table as now execs are students, and when the SGO changes roles of members selected as exec go to the exec table
- Can have an option to see requests to join CSO on top
- Have a search button to search users

**Decisions made:**

- Ask Vusani if it fine to get feedback from people other than witsies
- Everyone should test to increase code coverage
- Use CSOs going forward to be consistent with terminology
- The executive will no longer have a different dashboard
- Remove the subscription required when creating a CSO, not relevant if the sign ups are a blackbox
- Remove profile from SGO

**Action items:**<br>
_Action item - Person Responsible - Due Date_<br>
Work will be assigned after the sprint planning meeting with the client

CLOSURE<br>
The meeting was adjourned at 19:00. The next meeting will be the Sprint planning meeting held on online, 4 September 2025 at 19:00 with the client.

ADDITIONAL NOTES<br>
None

![Meeting Minutes](/Clubs-Connect/M5.png "Meeting")

---

MEETING DETAILS: SPRINT PLANNING MEETING<br>
**Date:** 04 September 2025<br>
**Time:** 19:00 - 19:45<br>
**Venue:** Teams (Online)<br>
**Attendees:** Busisiwe Mnisi, Theto Maunatlala, Mmakwena Moichela, Mukondi Ramabulana, Paballo Molaontoa, Vusani Radzilani (Client)<br>
**Absent:** None<br>

AGENDA

1. Opening and welcome
2. Feedback from client for Sprint 2
3. Features to be implemented for Sprint 3

MINUTES<br>

**Discussion points:**

Opening and welcome:

- Everyone is doing well

Feedback from the client for Sprint 2:

- We need to have a bug tracker, it's something we struggled with
- We need to improve documentation, we needed to document 3rd party code and justification - it was on the rubric. We need to have a full proof
- Deployment issues - everything we are working on should be deployed, the client should be able to run the application in his own time at his on his own pc.
- Bugs - need to be sorted, if they are affecting the logic, then we will lose marks
- Have more tests, they should be meaningful and show they were tested thoroughly. Which tests should we have as we are creating a production/industry application? We need to have test thoroughly
- Need to get more people for user feedback - we care about the feedback, does not matter how they get to interact with the application

Features to be implemented for Sprint 3:

- All APIs should be finalised
- All features that were not working on Sprint 2 should be working
- SGO should have an ability to remove people people from CSOs
- There should be a difference to a post that is seen by members or followers
- leave the functionality of removing a CSO to
- Assume that SGO has a list to change roles

**Decisions made:**

- Do work per role, and per week
- Present the features done during meeting before the marking
- Every week something must be done
- Meet every Tuesday during the lab slot and Fridays online at 7pm, but flexible
- Because of recesses, we will communicate via chat.
- Busisiwe to remind everyone every Tuesday and Fridays to write on the doc and also to move things along the Kanban board
- Think about having more APIs as we go in case we struggle with testing

**Action items:**<br>
_Action item - Person Responsible - Due Date_<br>

1. Implement the search button to search for users for SGO - Busisiwe Mnisi - 16 September 2025,
2. Adding execs to exec table when changing the role and test SGO functionality - Paballo Molaontoa - 16 September 2025,
3. Implement events functionality - Theto Maunatlala - 16 September 2025,
4. Make execs be able to post - Mukondi Ramabulana - 16 September 2025,
5. Implement searching for clubs and navigating to the CSO pages for students - Mmakwena Moichela - 16 September 2025,

CLOSURE<br>
The meeting was adjourned at 19:45. The next meeting will be the held on 16 September 2025 at 14:15 at the MSL Labs

ADDITIONAL NOTES<br>
Make sure the spelling is correct to avoid falling tests

![Meeting Minutes](/Clubs-Connect/M6.png "Meeting")

---

MEETING DETAILS<br>
**Date:** 16 September 2025<br>
**Time:** 14:15 - 17:00<br>
**Venue:** MSL Labs<br>
**Attendees:** Busisiwe Mnisi, Mukondi Ramabulana, Paballo Molaontoa<br>
**Absent:** Theto Maunatlala, Mmakwena Moichela<br>

AGENDA<br>

1. Opening and welcome
2. Progress of/on work done
3. Concerns, problems encountered

MINUTES<br>

**Discussion points:**

Opening and welcome:

- Everyone is doing well

Progress of/on work done:

- The change role to executive function is implemented
- The logic for the exec/student to see CSO page is implemented
- The search for CSO and students is implemented
- The creation of events is implemented.

Concerns, problems encountered:

- The members logic, how the table should look like in the database, and scalability issues
- The amount of APIs used, ask the client how many we should use exactly
- Due to workload from other modules as well, the feature implementation might be slow

**Decisions made:**

- Think about implementation of getting data from a CSV file
- Deploy the current features to get feedback on them.

**Action items:**<br>
_Action item - Person Responsible - Due Date_<br>

1. Test SGO files, look into starting a group chat for CSOs - Busisiwe Mnisi - 23 September 2025,
2. Implement update CSO and adding of members - Paballo Molaontoa - 23 September 2025,
3. Continue with events implementation and testing - Theto Maunatlala - 23 September 2025,
4. Implement seeing CSO students are a member of - Mukondi Ramabulana - 23 September 2025,
5. Implement latest posts showing on news feed - Mmakwena Moichela - 23 September 2025,

CLOSURE<br>
The meeting was adjourned at 17:00. The next meeting will be held at the MSL Labs, on 22 September 2025 at 14:15

ADDITIONAL NOTES<br>
None

![Meeting Minutes](/Clubs-Connect/M7.jpg "Meeting")

---

MEETING DETAILS<br>
**Date:** 25 September 2025<br>
**Time:** 18:00 - 20:00<br>
**Venue:** Discord (Online)<br>
**Attendees:** Busisiwe Mnisi, Paballo Molaontoa, Theto Maunatlala, Mmakwena Moichela<br>
**Absent:** Mukondi Ramabulana<br>

AGENDA<br>

1. Opening and welcome
2. Progress of/on work done
3. Concerns, problems encountered

MINUTES<br>

**Discussion points:**

Opening and welcome:

- Everyone is doing well

Progress of/on work done:

- The SGO profile is complete, they too can update their profile
- The events functionality is implemented, the exec can post events and students can see them
- The members functionality is implemented, the SGO can add members to CSOs
- The exec functionality to post for members or everyone is implemented

Concerns, problems encountered:

- Team members are behind on testing, at the moment the priority is implementing features whole balancing with other work but as soon they are done testing will also be done to increase code coverage
- Messaging is postponed to the next Sprint, the focus is to have all the features that are important done in this Sprint.

**Decisions made:**

- Meet with the client before the end of Sprint 3 and get feedback earlier on.

**Action items:**<br>
_Action item - Person Responsible - Due Date_<br>

1. Implement SGO announcements & do software audit - Busisiwe Mnisi - 25 September 2025,
2. Implement update CSO - Paballo Molaontoa - 25 September 2025,
3. Implement adding events into a calender- Theto Maunatlala - 25 September 2025,
4. Edit UI for exec posting - Mukondi Ramabulana - 25 September 2025,
5. Implement liking posts - Mmakwena Moichela - 25 September 2025,

CLOSURE<br>
The meeting was adjourned at 15:45. The next meeting will be online, 25 September 2025 at 18:00.

ADDITIONAL NOTES<br>
The team will meet an hour earlier on the 25th of September 2025 and meet the client later at 19:00.

![Meeting Minutes](/Clubs-Connect/M8.jpg "Meeting")

---

MEETING DETAILS<br>
**Date:** 25 September 2025<br>
**Time:** 19:00 - 20:00<br>
**Venue:** Online (Discord)<br>
**Attendees:** Busisiwe Mnisi, Paballo Molaontoa, Theto Maunatlala, Mmakwena Moichela, Mukondi Ramabulana<br>
**Absent:** None<br>

AGENDA<br>

1. Opening and welcome
2. Progress of/on work done
3. Concerns, problems encountered

MINUTES<br>

**Discussion points:**

Opening and welcome:

- Everyone is doing well

Progress of/on work done so far:

- The events are almost done, UI and calender are left. The announcements are done also the UI is left, and like and comments are in progress. Most of the work is still in progress.

Concerns, problems encountered:

- Testing, it has been a struggle for everyone, people will try their best but the main focus is to finish the features.

**Decisions made:**

- Some features will no longer be implemented like messaging, requesting financial statements, filling membership form and

**Action items:**<br>
_Action item - Person Responsible - Due Date_<br>

1. Continue with documentation, research - Busisiwe Mnisi - 29 September 2025,
2. User feedback, continue update CSO feature - Paballo Molaontoa - 29 September 2025,
3. Merge new features to main, add test users, document calendar API and finish events page - Theto Maunatlala - 29 September 2025,
4. UI and automated testing, start with exec collaboration - Mukondi Ramabulana - 29 September 2025,
5. Fix like and comment and do testing - Mmakwena Moichela - 29 September 2025,

CLOSURE<br>
The meeting was adjourned at 20:00. The next meeting will be at the MSL Labs, on 29 September 2025 at 14:15.

ADDITIONAL NOTES<br>
None.

![Meeting Minutes](/Clubs-Connect/M9.png "Meeting")

---

MEETING DETAILS<br>
**Date:** 29 September 2025<br>
**Time:** 16:00 - 17:00<br>
**Venue:** MSL Labs<br>
**Attendees:** Busisiwe Mnisi, Paballo Molaontoa, Theto Maunatlala, Mmakwena Moichela, Mukondi Ramabulana<br>
**Absent:** None<br>

AGENDA<br>

1. Opening and welcome
2. Progress of/on work done
3. Concerns, problems encountered

MINUTES<br>

**Discussion points:**

Opening and welcome:

- The team is fatigued because of the workload and is on the verge of dying.

Progress of/on work

- Comments and liking of posts is implemented
- Announcements are not working properly so they will not be shown to the client tomorrow.
- The student can see the CSOs they are part of on their profile
- Events can be added to the Google Calendar and the Exec can create events

Concerns, problems encountered:

- Testing, it has been a struggle for everyone, people will try their best but the main focus is to finish the features for the client.
- Deployment, the deployed site on GitHub pages is not working as expected and we will migrate to Azure.

**Decisions made:**

- To not touch the announcements, will fix the for the final submission

**Action items**<br>
_Action item - Person Responsible - Due Date_<br>

1. Continue with documentation - Busisiwe Mnisi - 30 September 2025,
2. Testing - Paballo Molaontoa - 30 September 2025,
3. Testing - Theto Maunatlala - 30 September 2025,
4. Testing - Mukondi Ramabulana - 29 September 2025,
5. Testing and deployment - Mmakwena Moichela - 30 September 2025,

CLOSURE<br>
The meeting was adjourned at 17:00. The next meeting will be at the MSL Labs with the client, on 30 September 2025 at 14:15.

ADDITIONAL NOTES<br>
None.

![Meeting Minutes](/Clubs-Connect/M10.jpg "Meeting")

---

MEETING DETAILS<br>
**Date:** 30 September 2025<br>
**Time:** 14:30 - 17:00<br>
**Venue:** MSL Labs<br>
**Attendees:** Busisiwe Mnisi, Paballo Molaontoa, Theto Maunatlala, Mmakwena Moichela, Mukondi Ramabulana, Vusani Radzilani<br>
**Absent:** None<br>

AGENDA<br>

1. Opening and welcome
2. Feedback from the client
3. Concerns, problems encountered

MINUTES<br>

**Discussion points:**

Opening and welcome:

- The team is fatigued.

Feedback from the client:

- User feedback: use GitHub to track user feedback, like the avatar one. Put an issue and then track it to resolve it, also get feedback on the changes and document them.
- Automated testing: Need to document what are we not testing. No redness in the coverage report, it must improve.
- Application: The cards for the group's joined needs to have an outline, to be clear a bit. Need to ensure that non-members don't see member I let posts.
- Think about the implementation of having a picture as a requirement when posting.
- Put in a loader so that the user can see it's loading or disable the buttons from being double clicked and post twice.
- API: Add more endpoints to the API, one is not enough
- Fix the redirect of the deployment app when we move to Azure

Concerns, problems encountered:

- Testing, our code coverage is bad and we don't have enough tests.

**Decisions made:**

- Have a conversation about what in and out of scope with tests
- Focus on making sure that the current functionality works and ensure that the app is thorough tested.

**Action items:**<br>
_Action item - Person Responsible - Due Date_<br>
We are still going to have a Sprint Planning Meeting, for now the team is on break.

CLOSURE<br>
The meeting was adjourned at 17:00. The next meeting will be confirmed.

ADDITIONAL NOTES<br>
None.

![Meeting Minutes](/Clubs-Connect/M11.jpg "Meeting")

---

MEETING DETAILS<br>
**Date:** 14 October 2025<br>
**Time:** 19:00 - 19:34<br>
**Venue:** Online (Discord)<br>
**Attendees:** Busisiwe Mnisi, Paballo Molaontoa, Theto Maunatlala, Mmakwena Moichela, Mukondi Ramabulana<br>
**Absent:** None<br>

AGENDA<br>

1. Opening and welcome
2. Progress on/of work

MINUTES<br>

**Discussion points:**

Opening and welcome:

- The team is fatigued.

Progress on/of work:

- A lot of the work was not done due to a test that the team had today for the Computer Graphics Course.
- We need to use an API of other groups, so we need to implement that during this week

**Decisions made:**

- Deploy the migrated application, if it works then we will go with it.
- Have work complete by Friday, 17 October 2025 as the team has a test on Monday.

**Action items:**<br>
_Action item - Person Responsible - Due Date_<br>

1. Fix announcements and editing of posts, thereafter focus on the documentation and group report - Busisiwe Mnisi - 17 October 2025,
2. Testing of SGO features- Paballo Molaontoa - 17 October 2025,
3. Testing and re-deploy API - Theto Maunatlala - 17 October 2025,
4. Testing and fix pages for deployment, make sure only members can see members only - Mukondi Ramabulana - 17 October 2025,
5. Testing and deployment, and add styling for other features - Mmakwena Moichela - 17 October 2025

CLOSURE<br>
The meeting was adjourned at 19:34. The next meeting will be on Friday the 17th of October 2025 online on Discord.

ADDITIONAL NOTES<br>
None.

![Meeting Minutes](/Clubs-Connect/M12.png "Meeting")

---

MEETING DETAILS<br>
**Date:** 17 October 2025<br>
**Time:** 16:00 - 16:40<br>
**Venue:** Online (Discord)<br>
**Attendees:** Busisiwe Mnisi, Paballo Molaontoa, Mmakwena Moichela, Mukondi Ramabulana<br>
**Absent:** Theto Maunatlala<br>

AGENDA<br>

1. Opening and welcome
2. Things yet to finalize

MINUTES<br>

**Discussion points:**

Opening and welcome:

- Everyone is overwhelmed as the submission is 2 days away. Theto Maunatlala sent her apologies and update on the work she has done so far.

Things yet to finalize:

- Testing, tests are still being done, we still have not met the code coverage yet. Also, the CI for testing is included
- Put logic for checking CSO, fix how CSOs look on search
- The navigation bar is fixed so that adapts to differnt screen sizes

**Decisions made:**

- Busisiwe Mnisi will submit the work.
- Have a meeting on Sunday evening to check if everything is ready to be submitted.

**Action items:**<br>
_Action item - Person Responsible - Due Date_<br>

1. Deploy documentation website, finish the documentation website and report - Busisiwe Mnisi - 19 October 2025,
2. Finish Testing of SGO features and write about user feedback- Paballo Molaontoa - 19 October 2025,
3. Write about API, - Theto Maunatlala - 19 October 2025,
4. Put logic for checking CSO, fix how CSOs look on search, write about automated testing - Mukondi Ramabulana - 19 October 2025,
5. Move deployment to master, continue with testing, write about deployment - Mmakwena Moichela - 19 October 2025

CLOSURE<br>
The meeting was adjourned at 16:40. This was the final documented meeting for the project development.

ADDITIONAL NOTES<br>
None.

![Meeting Minutes](/Clubs-Connect/M13.png "Meeting")
![Meeting Minutes](/Clubs-Connect/M14.png "Update from Thetho Maunatlala")

---
