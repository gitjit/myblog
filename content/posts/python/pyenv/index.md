+++
title = 'Pyenv in WSL'
date = 2024-10-28
categories = ["Python"]
toc = true
math = true
+++

# Setting Up `pyenv` in WSL (Ubuntu)

`pyenv` is a tool that allows you to manage multiple Python versions easily. This guide will walk you through setting up `pyenv` on **WSL Ubuntu** and installing Python **3.11**.


<img src="pyenv.webp" alt="pyenv image" style="width:60%; height:auto;">


## **Step 1: Update and Install Dependencies**
Before installing `pyenv`, update your system and install necessary build dependencies.

```sh
sudo apt update && sudo apt upgrade -y
sudo apt install -y make build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev curl \
    libncursesw5-dev xz-utils tk-dev libxml2-dev \
    libxmlsec1-dev libffi-dev liblzma-dev
```

These dependencies are required for compiling Python versions.

---

## **Step 2: Install `pyenv`**

Run the following command to install `pyenv`:

```sh
curl https://pyenv.run | bash
```

This script will:
- Clone `pyenv` into `~/.pyenv`
- Add necessary paths to your shell configuration

---

## **Step 3: Configure Shell for `pyenv`**
After installation, add the following lines to your **shell configuration file**.

### **For Bash (`~/.bashrc`)**
```sh
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
```
Then apply the changes:
```sh
source ~/.bashrc
```

### **For Zsh (`~/.zshrc`)**
If you are using **Zsh**, modify `~/.zshrc` instead and run:
```sh
source ~/.zshrc
```

---

## **Step 4: Verify `pyenv` Installation**
Check if `pyenv` is correctly installed by running:
```sh
pyenv --version
```
Expected output (version may vary):
```
pyenv 2.3.0
```

---

## **Step 5: Install Python 3.11 Using `pyenv`**

To list all available Python versions installable using `pyenv`:
```sh
pyenv install --list
```

Once `pyenv` is set up, you can install Python **3.11.5** (or the latest available version) using:
```sh
pyenv install 3.11.5
```

or if you try to install the latest version:
```sh
pyenv install 3.11
```
Once installed, you can check the installed versions:
```sh
pyenv versions
```

---

## **Step 6: Set Python 3.11 as Default Version**
To set Python **3.11.5** as the global default version:
```sh
pyenv global 3.11.5
```

To verify the installed Python version:
```sh
python --version
```
Expected output:
```
Python 3.11.5
```

To use a different Python version locally in a project directory:
```sh
pyenv local 3.11.5
```

---

## **How `pyenv` Internally Works**

###  How `pyenv` Manages Python Versions
- When you install a Python version using `pyenv install <version>`, it:
  1. **Downloads the Python source code** from official sources.
  2. **Compiles and installs Python** into `~/.pyenv/versions/<version>/`.
  3. **Creates a shim directory** at `~/.pyenv/shims/`, which intercepts Python-related commands.
  4. **Determines which Python version to use** based on:
     - The local `.python-version` file (if present in the current directory)
     - The `PYENV_VERSION` environment variable (if set)
     - The globally set Python version (`pyenv global <version>`)

### How `pyenv` Installs Python Packages
`pyenv` itself does **not** manage Python packages, but you can use package managers like `pip` inside a `pyenv` environment.

To install packages:
```sh
pip install <package>
```
- These packages will be installed in the respective Python version directory under `~/.pyenv/versions/<version>/lib/python3.x/site-packages/`.
- If you're using `pyenv virtualenv`, each virtual environment will have its own package directory.

### How `pyenv` Overrides System Python
- `pyenv` modifies your shell’s `PATH` to **prioritize its own versions of Python**.
- When you run `python`, your shell looks in `~/.pyenv/shims/`, which then directs to the correct Python binary.
- You can check which Python is currently being used with:
  ```sh
  which python
  ```
  Expected output:
  ```sh
  /home/user/.pyenv/shims/python
  ```

---



## **You're All Set! 🎉**
Now you have `pyenv` installed on **WSL Ubuntu**, and Python **3.11.5** is ready to use. 🚀
