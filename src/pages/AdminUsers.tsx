import { useState, useEffect } from "react";
import { adminService } from "../services/adminService";
import "../styles/admin.css";

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
}

interface ModalState {
  isOpen: boolean;
  type: "create" | "edit" | "role" | "delete";
  user?: UserData;
  formData?: {
    username?: string;
    email?: string;
    password?: string;
    role?: string;
  };
}

export const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "create",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
      setError("");
    } catch (err) {
      setError("Lỗi khi tải danh sách người dùng");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setModal({
      isOpen: true,
      type: "create",
      formData: { username: "", email: "", password: "", role: "USER" },
    });
  };

  const handleEditUser = (user: UserData) => {
    setModal({
      isOpen: true,
      type: "edit",
      user,
      formData: { email: user.email },
    });
  };

  const handleChangeRole = (user: UserData) => {
    setModal({
      isOpen: true,
      type: "role",
      user,
      formData: { role: user.role === "ADMIN" ? "USER" : "ADMIN" },
    });
  };

  const handleDeleteUser = (user: UserData) => {
    setModal({
      isOpen: true,
      type: "delete",
      user,
    });
  };

  const handleToggleStatus = async (user: UserData) => {
    try {
      const updatedUser = await adminService.toggleUserStatus(user.id);
      setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
      setSuccess(`Cập nhật trạng thái người dùng thành công`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Lỗi khi cập nhật trạng thái người dùng");
    }
  };

  const handleSubmitForm = async () => {
    try {
      if (modal.type === "create") {
        const newUser = await adminService.createUser({
          username: modal.formData?.username || "",
          email: modal.formData?.email || "",
          password: modal.formData?.password || "",
          role: modal.formData?.role || "USER",
        });
        setUsers([...users, newUser]);
        setSuccess("Tạo người dùng thành công");
      } else if (modal.type === "edit" && modal.user) {
        const updatedUser = await adminService.updateUser(modal.user.id, {
          email: modal.formData?.email,
          newPassword: modal.formData?.password,
        });
        setUsers(users.map((u) => (u.id === modal.user!.id ? updatedUser : u)));
        setSuccess("Cập nhật người dùng thành công");
      } else if (modal.type === "role" && modal.user) {
        const updatedUser = await adminService.changeUserRole(
          modal.user.id,
          modal.formData?.role || "",
        );
        setUsers(users.map((u) => (u.id === modal.user!.id ? updatedUser : u)));
        setSuccess("Thay đổi vai trò thành công");
      }
      setModal({ isOpen: false, type: "create" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Lỗi khi xử lý yêu cầu");
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modal.user) return;
    try {
      await adminService.deleteUser(modal.user.id);
      setUsers(users.filter((u) => u.id !== modal.user!.id));
      setSuccess("Xóa người dùng thành công");
      setModal({ isOpen: false, type: "create" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Lỗi khi xóa người dùng");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Quản lý Người dùng</h1>
        <button className="btn-primary" onClick={handleCreateUser}>
          + Tạo người dùng mới
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge ${user.role === "ADMIN" ? "badge-admin" : "badge-user"}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status ${user.enabled ? "status-active" : "status-inactive"}`}
                    >
                      {user.enabled ? "Hoạt động" : "Vô hiệu"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn-sm btn-edit"
                      onClick={() => handleEditUser(user)}
                      title="Chỉnh sửa"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-sm btn-role"
                      onClick={() => handleChangeRole(user)}
                      title="Đổi vai trò"
                    >
                      ⚙
                    </button>
                    <button
                      className="btn-sm btn-toggle"
                      onClick={() => handleToggleStatus(user)}
                      title="Chuyển trạng thái"
                    >
                      ◎
                    </button>
                    <button
                      className="btn-sm btn-delete"
                      onClick={() => handleDeleteUser(user)}
                      title="Xóa"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal.isOpen && (
        <div
          className="modal-overlay"
          onClick={() => setModal({ isOpen: false, type: "create" })}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modal.type === "create" && "Tạo Người dùng Mới"}
                {modal.type === "edit" && "Chỉnh sửa Người dùng"}
                {modal.type === "role" && "Đổi Vai trò"}
                {modal.type === "delete" && "Xác nhận Xóa"}
              </h2>
              <button
                className="modal-close"
                onClick={() => setModal({ isOpen: false, type: "create" })}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {modal.type === "delete" ? (
                <p>
                  Bạn có chắc chắn muốn xóa người dùng{" "}
                  <strong>{modal.user?.username}</strong>?
                </p>
              ) : (
                <form className="form">
                  {(modal.type === "create" || modal.type === "edit") && (
                    <>
                      {modal.type === "create" && (
                        <>
                          <div className="form-group">
                            <label>Tên người dùng *</label>
                            <input
                              type="text"
                              value={modal.formData?.username || ""}
                              onChange={(e) =>
                                setModal({
                                  ...modal,
                                  formData: {
                                    ...modal.formData,
                                    username: e.target.value,
                                  },
                                })
                              }
                              placeholder="Nhập tên người dùng"
                            />
                          </div>
                          <div className="form-group">
                            <label>Email *</label>
                            <input
                              type="email"
                              value={modal.formData?.email || ""}
                              onChange={(e) =>
                                setModal({
                                  ...modal,
                                  formData: {
                                    ...modal.formData,
                                    email: e.target.value,
                                  },
                                })
                              }
                              placeholder="Nhập email"
                            />
                          </div>
                          <div className="form-group">
                            <label>Mật khẩu *</label>
                            <input
                              type="password"
                              value={modal.formData?.password || ""}
                              onChange={(e) =>
                                setModal({
                                  ...modal,
                                  formData: {
                                    ...modal.formData,
                                    password: e.target.value,
                                  },
                                })
                              }
                              placeholder="Nhập mật khẩu"
                            />
                          </div>
                          <div className="form-group">
                            <label>Vai trò *</label>
                            <select
                              value={modal.formData?.role || "USER"}
                              onChange={(e) =>
                                setModal({
                                  ...modal,
                                  formData: {
                                    ...modal.formData,
                                    role: e.target.value,
                                  },
                                })
                              }
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </div>
                        </>
                      )}
                      {modal.type === "edit" && (
                        <>
                          <div className="form-group">
                            <label>Email</label>
                            <input
                              type="email"
                              value={modal.formData?.email || ""}
                              onChange={(e) =>
                                setModal({
                                  ...modal,
                                  formData: {
                                    ...modal.formData,
                                    email: e.target.value,
                                  },
                                })
                              }
                              placeholder="Nhập email"
                            />
                          </div>
                          <div className="form-group">
                            <label>Mật khẩu mới (để trống nếu không đổi)</label>
                            <input
                              type="password"
                              value={modal.formData?.password || ""}
                              onChange={(e) =>
                                setModal({
                                  ...modal,
                                  formData: {
                                    ...modal.formData,
                                    password: e.target.value,
                                  },
                                })
                              }
                              placeholder="Nhập mật khẩu mới"
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {modal.type === "role" && (
                    <div className="form-group">
                      <label>Vai trò mới</label>
                      <select
                        value={modal.formData?.role || "USER"}
                        onChange={(e) =>
                          setModal({
                            ...modal,
                            formData: {
                              ...modal.formData,
                              role: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                  )}
                </form>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setModal({ isOpen: false, type: "create" })}
              >
                Hủy
              </button>
              <button
                className={`btn-primary ${modal.type === "delete" ? "btn-danger" : ""}`}
                onClick={() =>
                  modal.type === "delete"
                    ? handleDeleteConfirm()
                    : handleSubmitForm()
                }
              >
                {modal.type === "delete" ? "Xóa" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
