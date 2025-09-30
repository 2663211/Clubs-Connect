---
title: User Acceptance Testing
description: Tests to check if users are satisfied
---

The following are user acceptance tests:

## User

- Given I am signed in, when I click the “Follow” button on a CSO page, then that CSO should appear in my followed list, and I should receive their updates.
- Given I am on the sign-up page, when I enter a valid Wits email and password, then my account should be created and I should be signed in.
- Given I have a registered account, when I enter my Wits email and password on the sign-in page, then I should gain access to the application.
- Given I am signed in and following a CSO, when I click the “Unfollow” button on the CSO page, then that CSO should be removed from my followed list and their content should no longer appear in my feed.
- Given I am signed in, when I toggle between dark and light mode in settings, then the application should update to the selected theme.
- Given I am signed in, when I navigate to my dashboard, then I should see a list of CSOs I follow or am a member of.
- Given I am signed in, when I open my newsfeed, then I should see the most recent posts from CSOs I follow or am a member of.
- Given I am signed in, when I select “Add to Calendar” for an upcoming event, then that event should appear in my personal calendar.
- Given I am signed in, when I type a CSO name or keyword into the search bar, then the system should return matching CSOs.
- Given I am signed in, when I click on a CSO name from search or my followed list, then I should be taken to that CSO’s page and see its posts.
- Given I am signed in, when I edit my profile and save changes, then the new information should be displayed in my profile.
- Given I am signed in and viewing my newsfeed, when I click the “Like” button on a post, then that post should show my like and update the like count.
- Given I have forgotten my password, when I click on forgot password, then I should be able to securely reset and update my password using a link sent to my email.

## SGO Officer

- Given I am signed in as an SGO officer, when I select “Add CSO” and enter valid details, then the CSO should be created and visible to users.
- Given I am signed in as an SGO officer, when I disable a CSO, then that CSO should no longer be accessible to users until re-enabled.
- Given I am signed in as an SGO officer, when I assign a role to a user, then that user should gain the permissions associated with the role.
- Given I am signed in as an SGO officer, when I delete a CSO, then it should be permanently removed from the application.
- Given I am signed in as an SGO officer, when I remove a member from a CSO, then that member should lose access to the CSO’s resources and events.
- Given I am signed in as an SGO officer, when I add a member to a CSO, then that member should gain access to the CSO’s resources and events.
- Given I am signed in as an SGO officer, when I update the details of a CSO, then the new information should replace the old information across the system.
- Given I am signed in, when I update my profile details, then my updated information should be displayed on my profile page.
- Given I am signed in as an SGO officer, when I search for a user on the dashboard, then the system should display matching users.
- Given I am signed in as an SGO officer, when I change a user’s role to “Executive,” then that user should have access to executive-level functions.
- Given I am signed in as an SGO officer, when I post an announcement, then it should be displayed on the announcements page for executives to view.
- Given I am signed in as an SGO officer and have created an announcement, when I open the announcement and select “Edit,” make changes, and save, then the announcement should be updated and the changes should be visible to executives.
- Given I am signed in as an SGO officer and have created an announcement, when I select “Delete” on that announcement and confirm the action, then the announcement should be permanently removed from the announcements page.

## Executive

- Given I am signed in as an executive, when I create and publish a post on my CSO’s page, then followers should see the post in their newsfeed.
- Given I am signed in as an executive, when I create an event for my CSO, then the event should be visible to members and available to add to their calendars.
- Given I am signed in as an executive, when I navigate to the announcements page, then I should see all announcements posted by SGO officers.
- Given I am signed in as an executive and have created a post on my CSO page, when I open the post and select “Edit,” make changes, and save, then the updated post should replace the previous version and be visible to followers.
- Given I am signed in as an executive and have created a post on my CSO page, when I select “Delete” on that post and confirm the action, then the post should be permanently removed from the CSO page and no longer appear in followers’ feeds.
