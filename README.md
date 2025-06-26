# Full Project

This repository contains a FastAPI backend and a React frontend. A simple Ansible playbook is provided to install all required dependencies on a remote host.

## Ansible usage

1. Edit `ansible/inventory.ini` and replace `your_server_ip` and `your_user` with the remote host details.
2. Update `project_root` in `ansible/install_dependencies.yml` if the project will be placed in a different directory on the remote host.
3. Run the playbook:

```bash
ansible-playbook -i ansible/inventory.ini ansible/install_dependencies.yml
```

The playbook installs system packages (Python, Node.js and build tools), then installs Python dependencies from `backend/requirements.txt` and Node dependencies for both the project root and the `frontend` directory.
