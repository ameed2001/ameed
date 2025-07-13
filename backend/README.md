# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## How to upload to GitHub

To upload your project code to a GitHub repository, follow these steps using the terminal in your development environment.

### Step 1: Initialize Git
First, initialize a new Git repository in your project's root directory.

```bash
git init
```

### Step 2: Add Files
Add all the files in your project to the staging area for Git.

```bash
git add .
```

### Step 3: Commit Your Files
Commit the files that you've staged in your local repository.

```bash
git commit -m "Initial commit"
```

### Step 4: Create a Repository on GitHub
1.  Go to [GitHub](https://github.com) and log in.
2.  Click the **+** icon in the top right corner and select **New repository**.
3.  Give your repository a name (e.g., `muhandis-al-hasib`).
4.  You can add a description (optional).
5.  Choose whether to make the repository public or private.
6.  **Important**: Do NOT initialize the new repository with a README, .gitignore, or license file, as your project already contains these.
7.  Click **Create repository**.

### Step 5: Link Your Local Repository to GitHub
On the next page, GitHub will show you a repository URL. Copy it. Then, in your terminal, run the following command, replacing `<URL>` with the URL you copied.

```bash
git remote add origin <URL>
```

### Step 6: Rename the Default Branch
It's a best practice to name the main branch `main`.

```bash
git branch -m main
```

### Step 7: Push Your Code
Finally, push your committed files from your local repository to GitHub.

```bash
git push -u origin main
```

Your code is now on GitHub!
