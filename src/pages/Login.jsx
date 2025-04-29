const Login = () => {
  return (
    <div className=" login-container d-flex align-items-center justify-content-center w-100" style={{ minHeight: '100%' }}>
      <div className="p-4 bg-white shadow rounded" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Admin Login</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" placeholder="admin@example.com" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};
export default Login;