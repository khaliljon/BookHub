
-- UNIVERSAL BOOKING PLATFORM DB SCHEMA
-- Generated: 2025-07-27 10:52:17

DROP TABLE IF EXISTS analytics, reviews, notifications, payments, bookings, work_schedules, seats, rooms, venues,
    users, roles, user_roles, permissions CASCADE;

-- USERS AND ROLES
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT,
    avatar TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_roles (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- OPTIONAL FINE-GRAIN PERMISSIONS
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    section TEXT NOT NULL,
    action TEXT NOT NULL,
    allowed BOOLEAN DEFAULT FALSE,
    UNIQUE(role_id, section, action)
);

-- VENUES: CLUB OR MASTER
CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('club', 'individual')), -- extensible
    description TEXT,
    location TEXT,
    owner_id INT REFERENCES users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ROOMS / CABINS
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    venue_id INT REFERENCES venues(id) ON DELETE CASCADE,
    name TEXT,
    room_type TEXT,
    metadata JSONB DEFAULT '{}'
);

-- SEATS / WORKSPACES
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
    label TEXT,
    seat_type TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'
);

-- SCHEDULES
CREATE TABLE work_schedules (
    id SERIAL PRIMARY KEY,
    venue_id INT REFERENCES venues(id) ON DELETE CASCADE,
    day_of_week TEXT, -- Monday, Tuesday...
    open_time TIME,
    close_time TIME
);

-- BOOKINGS
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    seat_id INT REFERENCES seats(id) ON DELETE SET NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    total_price DECIMAL(10,2),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    method TEXT,
    status TEXT DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    venue_id INT REFERENCES venues(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ANALYTICS LOGS
CREATE TABLE analytics (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action TEXT,
    data JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);
