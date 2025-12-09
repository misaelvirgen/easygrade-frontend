export async function getUserProfile() {
  const res = await fetch("/api/profile");
  return res.json();
}
