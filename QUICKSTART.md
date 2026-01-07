# Quick Start Guide - Teams Expense Tracker

## 🚀 Getting Started

### 1. Start the Application

**Terminal 1 - Backend:**
```bash
cd /home/softsensor/Desktop/expense-tracker/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /home/softsensor/Desktop/expense-tracker/frontend
npm run dev
```

### 2. Create a Manager User

**Option A - Via MongoDB:**
```bash
# Connect to MongoDB
mongosh

# Switch to your database (check your .env file for DB name)
use expense_tracker

# Update existing user to manager
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "manager" } }
)
```

**Option B - Directly in the Database:**
When creating a new user through signup, update the role field in MongoDB to "manager".

### 3. Test the Features

1. **Login** as manager user
2. **Click "Teams"** button in the dashboard header
3. **Create a new team:**
   - Click "Create Team"
   - Fill in: Name, Department, Description
   - Submit

4. **Add team expenses:**
   - Click on your team
   - Click "Add Expense"
   - Fill in expense details
   - Submit

5. **Set team budget:**
   - In team dashboard, click "Set Budget"
   - Enter amount
   - Budget alerts will show when exceeded

6. **View analytics:**
   - Click "Analytics" tab
   - See charts and breakdowns

7. **Manage members:**
   - Click "Members" tab
   - Add/remove team members (you'll need other user IDs)

---

## 📋 Key Features to Test

### ✅ Manager Features
- [ ] Create team
- [ ] Update team info
- [ ] Add team members
- [ ] Remove team members
- [ ] Set team budget
- [ ] Create team expenses
- [ ] Edit any team expense
- [ ] Delete any team expense
- [ ] View team analytics

### ✅ Member Features
- [ ] View teams they're part of
- [ ] Create team expenses
- [ ] Edit own team expenses
- [ ] Delete own team expenses
- [ ] View team analytics

### ✅ Viewer Features
- [ ] View teams they're part of
- [ ] View team expenses (read-only)
- [ ] View team analytics (read-only)

---

## 🔍 Testing Checklist

1. **Personal vs Team Expenses:**
   - Verify personal expenses work as before
   - Teams are completely separate from personal
   - Navigation between Personal and Teams works

2. **Permissions:**
   - Non-managers cannot create teams
   - Members cannot add/remove other members
   - Viewers cannot create expenses

3. **Budget Alerts:**
   - Set a low budget (e.g., $100)
   - Add expenses that exceed it
   - Verify alert appears

4. **Month Filtering:**
   - Change month selector
   - Verify expenses filter correctly
   - Budget changes for each month

5. **Analytics:**
   - Add expenses in different categories
   - Verify pie chart shows correct breakdown
   - Member breakdown shows who spent what

---

## 🐛 Troubleshooting

### Backend won't start:
- Check MongoDB is running: `sudo systemctl status mongod`
- Check Redis is running: `sudo systemctl status redis-server`
- Verify .env file has correct values

### Frontend shows errors:
- Clear browser cache
- Check browser console for specific errors
- Verify API_URL in frontend .env

### Cannot create team:
- Verify user role is "manager" in database
- Check backend console for errors
- Verify JWT token is being sent

### Member addition not working:
- This requires user lookup by email (not fully implemented)
- For testing, you can manually add user IDs in the code
- Or implement the email lookup endpoint

---

## 📱 User Flow Example

```
1. Login as Manager → Dashboard
2. Click "Teams" → Teams Page
3. Click "Create Team" → Fill Form → Submit
4. Team appears in grid → Click on it → Team Dashboard
5. Click "Set Budget" → Enter $1000 → Submit
6. Click "Add Expense" → Fill details → Submit
7. Expense appears in table
8. Summary cards update automatically
9. Click "Analytics" → View charts
10. Click "Members" → (Add members if you have user IDs)
11. Click "Back to Dashboard" → Return to personal expenses
```

---

## 💡 Tips

- Start with creating one team and testing all features
- Use different categories to see analytics work
- Set realistic budgets to test alerts
- Toggle between months to see filtering
- Check both personal and team views to ensure separation

---

## 🎯 What's Next?

After basic testing, consider implementing:
1. Email-based user lookup for adding members
2. Expense approval workflows
3. Email notifications for budget alerts
4. PDF export for reports
5. File attachments for expenses

---

Enjoy your new Teams Expense Tracker! 🎉
