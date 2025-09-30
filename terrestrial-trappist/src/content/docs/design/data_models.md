---
title: Data Models
description: ERD
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
