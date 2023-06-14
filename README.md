# CS569-June-2023-Final-Project
The project repository should be "Accepted/Forked" by team leaders only. One team member (team leader) will add their team members as "collaborators" so they could collaborate and push their code.

## You will be building a Track and Split Expenses application:
The application creates a shared space between a group of users to track their spending and display how much each user owes.
1. Users signup and signin before they could use the application.
2. A user creates a "spending group", the user becomes a member and sends invitations to other users using their email ID. Invitees would have to sign in, find any 'pending requests' and accept the invitation to be part of the group. 
3. Users within the "spending group" report transactions as follows: Title, Description, Paid by, Category, Amount, Date, and Receipt Picture File. 
4. The app displays a full list of transactions per "spending group" with the ability to search/filter it by Title, Paid by, Category, and Date from/to.
5. The app displays a "split balance" report for the "spending group" with the details of the owed amount for each user. For example:
    * User A spent $100 in total => owes $0. (green)
    * User B spent $200 in total => owes -$100. (green)
    * User C spent $0 in total => owes $100. (red)
## Progress report & Notes

* A daily push is required from each team member to track their code and performance. Missing the push affects your grade.
* Remember to update the .gitignore file so you do not push `node_modules` or any private keys from `.env` file. 

## Need assistance?

Feel free to contact me any day between 8 AM and 8 PM. I’m available to assist all teams with all kinds of requests (system design, backend, frontend, fixing code bugs.. etc). The project is a learning experience and I want everyone to finish the project successfully and meet the course learning outcomes.

## Final Evaluation 

The submission deadline is on Sunday 9:00 PM. I will meet with every team individually on Monday and Tuesday mornings and evaluate the final project code. Be prepared to answer any technical questions.  

Good luck, and happy coding!

You may use the following schema design for the backend API:
```js
const UserSchema = new Schema({
    fullname: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
})

const SpendingGroupSchema = new Schema({
    title: { type: String, require: true },
    members: [{
        user_id: mongoose.Types.ObjectId,
        fullname: String,
        email: String,
        pending: { type: Boolean, default: true }
    }],
    transactions: [{
        title: String,
        description: String,
        paid_by: { user_id: mongoose.Types.ObjectId, fullname: String },
        category: String,
        amount: Number,
        date: Number,
        receipt: {filename: String, originalname: String}
    }],
})
```

_Code Honor Submission Policy: Remember to respect the code honor submission policy. All written code must be original. Presenting any code as one’s own work when it came from another source is plagiarism, which includes any matching patterns and code snippets, and will affect your grade. The use of AI is not permitted in this assignment. For more details, check the full course policies in the syllabus._
