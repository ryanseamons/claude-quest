# Level 3: Making Things Happen with Claude

## Mission Briefing

Now that you can chat with Claude, it's time to actually BUILD something! In this level, you'll learn how to ask Claude to create real programs that do real things.

---

## How Claude Creates Code

When you ask Claude to build something, it:
1. Understands what you want
2. Writes the code for you
3. Saves it to a file
4. Can even run it for you!

You'll see Claude "thinking" and then creating files. It's like magic, but it's really just smart AI!

---

## Your First Real Program

Let's create something simple but cool. Start Claude Code:

```bash
cd ~/Desktop/code-quest
claude
```

Now type this prompt:

```
Create a Python program called "greeter.py" that asks for my name
and then greets me in a fun way
```

Watch what Claude does! It will:
1. Create a file called `greeter.py`
2. Write the code inside it
3. Probably offer to run it for you

---

## Understanding What Happened

After Claude creates the file, you can:

**Run it yourself:**
```bash
python greeter.py
```

**Look at the code Claude wrote:**
Ask Claude: "Can you show me what's in greeter.py and explain each line?"

---

## Try It: Build These Programs

Here are 5 mini-projects to try. Ask Claude to create each one!

### 1. The Fortune Teller
```
Create a Python program called "fortune.py" that gives me a random
fortune or prediction when I run it
```

### 2. The Math Helper
```
Create a Python program called "mathquiz.py" that gives me a random
addition problem and checks if my answer is correct
```

### 3. The Compliment Generator
```
Create a Python program called "compliment.py" that gives me a
random compliment to make me smile
```

### 4. The Countdown Timer
```
Create a Python program called "countdown.py" that counts down
from 10 to 1 and then says "Blast off!"
```

### 5. The Rock Paper Scissors Game
```
Create a Python program called "rps.py" that lets me play
rock paper scissors against the computer
```

---

## What to Do When Something Goes Wrong

**Error messages are not failures - they're clues!**

If you see an error, try saying to Claude:
- "I got this error: [paste the error]. What does it mean?"
- "The program isn't working. Can you help me fix it?"
- "Can you run the program and see if there are any problems?"

---

## Cool Things to Ask Claude

Once you have a working program, try these:

### Make It Better
- "Can you add colors to the output?"
- "Can you make it ask if I want to play again?"
- "Can you add a score counter?"

### Understand It
- "Explain this code line by line like I'm 12"
- "What would happen if I changed [this part]?"
- "Why did you use [this thing] instead of [that thing]?"

### Experiment
- "What if we made it harder?"
- "Can you add sound effects?" (might need extra setup)
- "Can you make it multiplayer?"

---

## The Files You Created

After building these programs, try this in your terminal:

```bash
ls
```

You should see all your files! Each `.py` file is a Python program you (with Claude's help) created.

To run any of them:
```bash
python filename.py
```

---

## Level Complete Checklist

- [ ] I created the greeter program
- [ ] I ran a program I created
- [ ] I asked Claude to explain code to me
- [ ] I created at least 2 of the mini-projects
- [ ] I asked Claude to improve one of my programs

---

## Mini-Projects Score Card

| Project | Created? | Ran It? | Improved It? |
|---------|----------|---------|--------------|
| greeter.py | [ ] | [ ] | [ ] |
| fortune.py | [ ] | [ ] | [ ] |
| mathquiz.py | [ ] | [ ] | [ ] |
| compliment.py | [ ] | [ ] | [ ] |
| countdown.py | [ ] | [ ] | [ ] |
| rps.py | [ ] | [ ] | [ ] |

---

## Pro Tips for Great Prompts

**Be clear about what you want:**
- BAD: "make a game"
- GOOD: "make a number guessing game where I guess 1-100 and you tell me higher or lower"

**Tell Claude the filename:**
- GOOD: "create a file called mygame.py"

**Ask for explanations:**
- GOOD: "...and explain the code as you write it"

---

## Achievement Unlocked: Code Creator!

You just wrote real computer programs! These are the same kinds of files that professional developers create. You're coding!

**Next up:** Level 4 - Bigger Projects!

---

*Remember: Every expert was once a beginner. You're doing great!*
