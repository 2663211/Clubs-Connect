---
title: User Acceptance Testing (UAT)
description: Tests to check if users are satisfied
---

User Acceptance Testing (UAT) is a process used to evaluate a product’s usability from the perspective of the end user. Its primary objective is to determine how effectively the software meets user needs and delivers the intended solutions to the target audience. UAT closely mirrors real-world usage scenarios, allowing users to interact with the software and evaluate its overall functionality (Cser, 2024).

In standard software development practice, User Acceptance Testing is typically conducted toward the end of the development cycle, once other forms of testing have been completed. However, in the development of the Clubs Connect platform, UAT was carried out early and iteratively throughout the project. Testing was performed at the end of each sprint to gather continuous feedback that informed improvements to product performance and user experience. This approach ensured that the platform evolved according to the needs of its intended users.

## UAT Process

The User Acceptance Testing process for Clubs Connect followed these key steps:

- **Analysis of Requirements and Business Rules:** the team analysed the business objectives and requirements documented during the planning phase to ensure all test scenarios aligned with project goals.

- **Creation of User Acceptance Tests:** user stories were developed early in the project and used to design specific UAT scenarios. These scenarios served as a guide for evaluating the platform from a user’s perspective.

- **Creation of Feedback Form:** a Google Form was created to collect feedback from users who tested the platform. The form questions were based on the user acceptance test scenarios to ensure structured and relevant responses.
  The form used for collecting feedback is this: <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdDXXtfUHauEi_5OyyyE0EyUOtErnvvPEt6sx58qZgLe2vqPg/viewform?embedded=true" width="640" height="3000" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>

- **Direct observations:** an alternative to using the feedback form to give feedback was direct observation, some of the team members met with users and allowed them to use the application while observing how they use it and getting feedback.

- **Results and Analysis:** UAT sessions were conducted throughout development to gather feedback from users. The collected responses were analysed, and recommended changes were implemented to enhance the platform. Summaries of the findings and improvements are included below.

## User Acceptance Tests

The following are user acceptance tests:

### User

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

### SGO Officer

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

### Executive

- Given I am signed in as an executive, when I create and publish a post on my CSO’s page, then followers should see the post in their newsfeed.
- Given I am signed in as an executive, when I create an event for my CSO, then the event should be visible to members and available to add to their calendars.
- Given I am signed in as an executive, when I navigate to the announcements page, then I should see all announcements posted by SGO officers.
- Given I am signed in as an executive and have created a post on my CSO page, when I open the post and select “Edit,” make changes, and save, then the updated post should replace the previous version and be visible to followers.
- Given I am signed in as an executive and have created a post on my CSO page, when I select “Delete” on that post and confirm the action, then the post should be permanently removed from the CSO page and no longer appear in followers’ feeds.

## Results

<iframe width="700" height="600" src="https://lookerstudio.google.com/embed/reporting/9f0f09f5-c662-4127-bf9d-d31a37569b71/page/0U2bF" frameborder="0" style="border:0" allowfullscreen sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>

After collecting feedback from users through surveys and direct observation, the responses were analysed to understand how students experienced Clubs Connect and how the system could be improved. Overall, the feedback received was highly positive, with most participants expressing enthusiasm about the concept of the application and its potential usefulness for Wits students. Many users even mentioned that Clubs Connect looked and felt like an official Wits University platform, largely due to the colour scheme and the overall layout. They believed it would be a valuable system for the university to adopt since there is currently no centralized platform for managing student clubs and societies.

**General Impressions**
Many users found the application easy to navigate and understand. They reported that moving from the homepage to signing up and accessing the main app interface was smooth and intuitive. This confirmed that the navigation design effectively supported a logical flow through the system. The consistency in page structure and button placement also helped users feel comfortable exploring the different features without much assistance.

**Feedback on Roles and Dashboards**
Since Clubs Connect includes multiple user roles such as Students, Executives, and SGO (Student Governance Office), users were encouraged to test the functionality of each dashboard. Feedback from users who explored the SGO dashboard was particularly positive. They appreciated the high level of control that the SGO role had, such as the ability to delete profiles, create clubs, edit or delete posts, and manage club memberships. Users noted that these permissions accurately reflected how a real administrative role would function and gave the platform a sense of realism and authority.
On the other hand, students testing the Student Dashboard enjoyed the ability to follow any number of clubs or societies without restriction. They found this feature convenient and felt it encouraged engagement with various student groups. The clarity of club listings and the simplicity of following or unfollowing clubs were seen as major strengths of the design.

**Interface and Aesthetic Feedback**
In terms of design, several users commented positively on the use of Wits-inspired colours, which gave the app a familiar and official look. However, some users suggested that the colour palette could be updated to make the interface feel more modern or vibrant. Since user interface preferences are subjective, this feedback was noted for consideration in future iterations but was not treated as an immediate issue. The key takeaway was that while aesthetics can vary in appeal, the app’s usability remained strong across all users.

**Functional Improvements Based on Feedback**
A few important suggestions from users led directly to implemented improvements. One common request was for posts within clubs to display who created them. Users felt that showing the author of a post would add transparency and context, especially in busy clubs with multiple administrators. In response to this, the feature was added, each post now clearly displays the name of the user who made it.
Another issue raised involved user profiles. Initially, the gender placeholder in the profile section defaulted to “Female,” which some male users found inaccurate or exclusionary. Based on this feedback, the placeholder was changed to a gender-neutral value to make the platform more inclusive for all users.

**Addressing Account Management Concerns**
One participant raised a practical question about what would happen if a user forgot their password. At the time, this functionality had not been implemented, and the developer jokingly responded that users simply could not forget it. However, the comment highlighted a real limitation regarding authentication and password recovery. To address this, the team decided to integrate Google Sign-In as the exclusive login method. This not only eliminated the need for password management but also enhanced security, as user credentials were protected by Google’s authentication system. This solution was beneficial for both users and developers, as it simplified the login process and reduced security risks.

**Summary of Insights**
In summary, the feedback confirmed that Clubs Connect successfully met its goal of providing an intuitive and accessible platform for student engagement. Users praised its structure, navigation, and realism, and several of their suggestions directly led to meaningful improvements in the system. While a few comments touched on personal preferences such as colours or layout aesthetics, the overall response demonstrated strong approval and genuine interest in the project’s potential. The feedback process not only validated the design choices made by the team but also guided thoughtful refinements that enhanced usability and inclusivity. Ultimately, user feedback not only strengthened the quality of the final product but also emphasized the importance of user-centered design in building meaningful and functional applications.
