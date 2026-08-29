const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function to build headers (adds auth token if present)
const getHeaders = (token?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// 1. PUBLIC CATALOG ENDPOINTS
export async function getRooms() {
  const res = await fetch(`${API_BASE_URL}/rooms`);
  if (!res.ok) throw new Error("Failed to fetch room catalog.");
  return res.json();
}

export async function getRoomBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/rooms/${slug}`);
  if (!res.ok) throw new Error(`Failed to fetch details for suite: ${slug}`);
  return res.json();
}

export async function searchAvailability(checkIn: string, checkOut: string, guests: number) {
  const res = await fetch(
    `${API_BASE_URL}/rooms/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
  );
  if (!res.ok) throw new Error("Failed to search room availability.");
  return res.json();
}

// 2. RESERVATION SYSTEM ENDPOINTS
export async function createBooking(
  data: {
    roomId: string;
    userId?: string | null;
    guestName: string;
    email: string;
    phone: string;
    guests: number;
    checkIn: string;
    checkOut: string;
    specialRequest?: string;
  },
  token?: string
) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to submit booking.");
  }
  return res.json();
}

export async function getBookingDetails(id: string) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`);
  if (!res.ok) throw new Error("Failed to retrieve booking information.");
  return res.json();
}

export async function cancelBooking(id: string) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to cancel reservation.");
  return res.json();
}

// 3. CONTACT FORM INQUIRIES
export async function sendContactMessage(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to submit inquiry.");
  }
  return res.json();
}

// 4. ADMIN AUTHENTICATION
export async function loginAdmin(data: { email: string; passwordString: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email: data.email,
      password: data.passwordString,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Invalid credentials.");
  }
  return res.json();
}

export async function getAdminProfile(token: string) {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Unauthorized session.");
  return res.json();
}

// 5. PROTECTED ADMIN MANAGEMENT ENDPOINTS
export async function getAdminBookings(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/bookings`, {
    method: "GET",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch admin bookings.");
  return res.json();
}

export async function updateBookingStatus(token: string, id: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update booking status.");
  return res.json();
}

export async function getAdminRooms(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/rooms`, {
    method: "GET",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch administrative room catalog.");
  return res.json();
}

export async function createRoom(token: string, roomData: any) {
  const res = await fetch(`${API_BASE_URL}/admin/rooms`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(roomData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create suite.");
  }
  return res.json();
}

export async function updateRoom(token: string, id: string, roomData: any) {
  const res = await fetch(`${API_BASE_URL}/admin/rooms/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(roomData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update suite.");
  }
  return res.json();
}

export async function deleteRoom(token: string, id: string) {
  const res = await fetch(`${API_BASE_URL}/admin/rooms/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete suite.");
  return res.json();
}

export async function getAdminMessages(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/messages`, {
    method: "GET",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch contact inquiries.");
  return res.json();
}

// 6. USER AUTHENTICATION
export async function signupUser(data: { name: string; email: string; passwordString: string }) {
  const res = await fetch(`${API_BASE_URL}/users/signup`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.passwordString,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Registration failed.");
  }
  return res.json();
}

export async function loginUser(data: { email: string; passwordString: string }) {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email: data.email,
      password: data.passwordString,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Invalid credentials.");
  }
  return res.json();
}

export async function getUserProfile(token: string) {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Unauthorized user session.");
  return res.json();
}

export async function getUserBookings(token: string) {
  const res = await fetch(`${API_BASE_URL}/users/bookings`, {
    method: "GET",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch user bookings.");
  return res.json();
}
