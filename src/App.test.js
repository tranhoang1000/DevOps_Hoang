import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App login flow', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  test('allows admin login and shows the admin dashboard', async () => {
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await userEvent.type(screen.getByLabelText(/^email$/i), 'admin123@gmail.com');
    await userEvent.type(screen.getByLabelText(/^mật khẩu$/i), 'admin123');
    await userEvent.click(screen.getAllByRole('button', { name: /đăng nhập/i })[1]);

    expect(await screen.findByRole('heading', { name: /quản lý phim/i })).toBeInTheDocument();
  });

  test('shows newly added movie title in the admin table after adding', async () => {
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await userEvent.type(screen.getByLabelText(/^email$/i), 'admin123@gmail.com');
    await userEvent.type(screen.getByLabelText(/^mật khẩu$/i), 'admin123');
    await userEvent.click(screen.getAllByRole('button', { name: /đăng nhập/i })[1]);

    await screen.findByRole('heading', { name: /quản lý phim/i });

    await userEvent.type(screen.getByPlaceholderText(/tiêu đề phim/i), 'Phim test mới');
    await userEvent.type(screen.getByPlaceholderText(/thể loại/i), 'action');
    await userEvent.type(screen.getByPlaceholderText(/ngày phát hành/i), '2025');
    await userEvent.type(screen.getByPlaceholderText(/url hình ảnh/i), 'https://example.com/image.jpg');
    await userEvent.type(screen.getByPlaceholderText(/url video/i), 'https://example.com/video.mp4');
    await userEvent.type(screen.getByPlaceholderText(/mô tả/i), 'Mô tả phim test mới');
    await userEvent.click(screen.getByRole('button', { name: /thêm phim/i }));

    const titleMatches = await screen.findAllByText(/phim test mới/i);
    expect(titleMatches.length).toBeGreaterThan(0);
  });
});
