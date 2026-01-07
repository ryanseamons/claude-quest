# Level 1: Terminal Basics

## Mission Briefing

Welcome, adventurer! Before you can team up with your AI coding buddy, you need to learn how to talk to your computer in its secret language. This is called using the **terminal** (or command line).

Think of it like this: normally you click on things with your mouse. But coders type commands instead - it's like texting your computer and having it do exactly what you say!

---

## What is a Terminal?

The terminal is a text-based way to control your computer. Instead of clicking icons, you type commands.

**Why use it?**
- It's FASTER once you know how
- It's how programmers work
- It's the only way to use Claude Code
- It makes you feel like a hacker in the movies (in a good way!)

```
+------------------------------------------+
|  Terminal                          - [] X |
|------------------------------------------|
| $ hello computer                          |
| computer says: I don't understand...      |
| $ ls                                      |
| Documents  Downloads  Pictures  Music     |
| $                                         |
+------------------------------------------+
```

---

## Opening Your Terminal

### On Mac:
1. Press `Cmd + Space` (opens Spotlight search)
2. Type "Terminal"
3. Press Enter

### On Windows:
1. Press `Windows key`
2. Type "PowerShell" or "Command Prompt"
3. Click to open

### On Linux:
1. Press `Ctrl + Alt + T`

**Checkpoint:** You should see a window with a blinking cursor. That's your terminal!

---

## Your First Commands

Let's try some commands! Type each one and press Enter.

### Command 1: `pwd` - Where Am I?

```bash
pwd
```

This stands for "Print Working Directory" - it tells you where you are in the computer.

You'll see something like: `/Users/yourname`

Think of it like asking "What room of the house am I in?"

---

### Command 2: `ls` - What's Here?

```bash
ls
```

This "lists" everything in your current location - files and folders!

You'll see things like: `Desktop  Documents  Downloads  Pictures`

Think of it like asking "What's in this room?"

---

### Command 3: `cd` - Move Around

```bash
cd Desktop
```

This "changes directory" - it moves you to a different folder.

Now try `pwd` again - you moved!

To go back up one level:
```bash
cd ..
```

The `..` means "go back to the parent folder"

---

### Command 4: `mkdir` - Create a Folder

```bash
mkdir my-first-folder
```

This "makes a directory" (folder) with that name!

Try `ls` to see it appeared!

---

### Command 5: `clear` - Clean Up

```bash
clear
```

This clears the screen. Nice and tidy!

---

## Try It: Navigation Challenge

Complete these steps in order:

- [ ] Open your terminal
- [ ] Type `pwd` to see where you are
- [ ] Type `ls` to see what's there
- [ ] Type `cd Desktop` to go to Desktop
- [ ] Type `mkdir code-quest` to make a new folder
- [ ] Type `cd code-quest` to go inside it
- [ ] Type `pwd` to confirm you're in your new folder

**Did your path end with `/code-quest`? You did it!**

---

## Quick Reference Card

| Command | What It Does | Memory Trick |
|---------|--------------|--------------|
| `pwd` | Shows current location | "Print Where am I at, Dude?" |
| `ls` | Lists files and folders | "List Stuff" |
| `cd` | Changes folder | "Change Directory" |
| `cd ..` | Goes back one folder | Two dots = go back |
| `mkdir` | Creates a new folder | "Make Directory" |
| `clear` | Cleans the screen | Clears the clutter |

---

## Common Mistakes (And How to Fix Them)

**"Command not found"**
- You probably misspelled something. Computers are very picky!
- Check for typos and try again

**"No such file or directory"**
- The folder you're trying to go to doesn't exist
- Use `ls` to see what folders ARE there

**"Permission denied"**
- You're trying to access something protected
- Try a different folder

---

## Side Quests (Bonus Challenges)

1. **Explorer Badge:** Navigate to three different folders and back
2. **Architect Badge:** Create a folder inside a folder inside a folder
3. **Cleanup Badge:** Figure out how to delete a folder (hint: try searching "how to delete folder terminal")

---

## Level Complete Checklist

- [ ] I can open the terminal
- [ ] I know what `pwd` does
- [ ] I know what `ls` does
- [ ] I can navigate with `cd`
- [ ] I created a folder called `code-quest`

---

## Achievement Unlocked: Terminal Navigator!

You now speak basic computer! This is a REAL skill that professional programmers use every day.

**Next up:** Level 2 - Meet Claude Code, your AI coding companion!

---

*Pro tip: Keep this page open as a reference. Even experienced coders look things up!*
