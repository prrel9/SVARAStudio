# Database Design

## Database

PostgreSQL (Supabase)

---

# User Roles

- Admin
- Customer

Future

- Staff
- Super Admin

---

# Tables

## profiles

User information

- id
- full_name
- email
- phone
- avatar
- role
- created_at
- updated_at

---

## studios

Studio master data

- id
- name
- slug
- description
- thumbnail
- capacity
- price_per_hour
- room_size
- equipment_level
- is_active

---

## studio_images

Gallery for every studio

- id
- studio_id
- image_url
- sort_order

---

## studio_models

Three.js assets

- id
- studio_id
- model_url
- preview_image
- version

---

## equipment_categories

Equipment grouping

- id
- name

Examples

- Drum
- Guitar
- Bass
- Keyboard
- Amplifier
- Mixer
- Microphone

---

## equipments

Master equipment

- id
- category_id
- brand
- model
- description

---

## studio_equipments

Equipment inside studio

- id
- studio_id
- equipment_id
- quantity

---

## schedules

Studio availability

- id
- studio_id
- date
- start_time
- end_time
- status

Status

- available
- booked
- maintenance

---

## bookings

Booking data

- id
- user_id
- studio_id
- booking_date
- start_time
- end_time
- total_price
- status
- notes

Status

- pending
- confirmed
- completed
- cancelled

---

## notifications

User notifications

- id
- user_id
- title
- message
- is_read

---

## reviews

Customer reviews

- id
- user_id
- studio_id
- rating
- review

---

## gallery

Landing page gallery

- id
- image
- title

---

## settings

Website configuration

- id
- site_name
- whatsapp
- email
- address
- instagram
- operating_hours

---

# Storage Buckets

avatars

studio-images

studio-models

gallery

---

# Relationships

Profile

↓

Bookings

↓

Studio

↓

Schedule

↓

Equipment

↓

Reviews

---

# Authentication

Supabase Auth

Role Based Access

Admin

Customer

---

# Admin Permissions

Manage Studios

Manage Equipment

Manage Schedules

Manage Bookings

Manage Gallery

Manage Reviews

Manage Users

Manage Settings

---

# Customer Permissions

View Studios

Book Studio

Cancel Booking

View Schedule

Edit Profile

Create Review

---

# Indexes

email

slug

booking_date

studio_id

user_id

status

---

# Future Tables

payments

promo_codes

memberships

activity_logs

favorites

payment_methods

coupons

audit_logs

---

# Database Principles

Normalize data.

Avoid duplicate information.

Use UUID.

Use foreign keys.

Enable Row Level Security.

Soft delete when necessary.

Keep database scalable.