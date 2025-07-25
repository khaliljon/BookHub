import { User, CreateUserRequest, UpdateUserRequest } from '../types';

const API_URL = '/api/users';

function getToken() {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Нет токена авторизации. Залогиньтесь!');
  return token;
}

export async function fetchUsers(): Promise<User[]> {
  const token = getToken();
  const res = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Ошибка загрузки пользователей');
  return res.json();
}

export async function createUser(data: CreateUserRequest): Promise<User> {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Ошибка создания пользователя');
  return res.json();
}

export async function updateUser(data: UpdateUserRequest & { id: number }): Promise<void> {
  const token = getToken();
  // Не отправляем managedClubId, balance, points, isDeleted если они undefined или null
  const clean: any = { ...data };
  if (clean.managedClubId == null) delete clean.managedClubId;
  if (clean.balance === undefined) delete clean.balance;
  if (clean.points === undefined) delete clean.points;
  if (clean.isDeleted === undefined) delete clean.isDeleted;
  const res = await fetch(`${API_URL}/${data.id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clean),
  });
  if (!res.ok) throw new Error('Ошибка обновления пользователя');
  // Сервер возвращает 204 No Content, поэтому не вызываем res.json()
  return;
}

export async function deleteUser(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Ошибка удаления пользователя');
}