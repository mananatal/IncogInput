# Project Name: IncogInput 


## Project Summary:
IncogInput is an anonymous feedback platform where users can share their thoughts without revealing their identity. Whether it's for personal growth, professional improvement, or just an honest opinion, IncogInput makes it easy to receive candid feedback.

### Key Features of **IncogInput**

1. **Anonymous Feedback Submission**: Allows users to send feedback anonymously while maintaining privacy.  
2. **AI-Suggested Feedback**: Enhances user input by providing AI-generated suggestions for constructive feedback.  
3. **User Authentication and Authorization**: Secures access with authentication via Next-Auth and ensures appropriate authorization.  
4. **Dark and Light Mode**: Offers customizable themes for better usability and accessibility.  
5. **Email Verification with OTP**: Provides reliable email verification to ensure secure user registration and login.  
6. **Responsive UI**: Features a responsive design to deliver seamless user experience across devices.


## Project Duration:
I've dedicated over a month to develop and refine this project.



## Installation:
1. Clone the repository: `git clone https://github.com/mananatal/IncogInput.git`
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`


## Environment Variables:

To run this project, you will need to set up the following environment variables in a `.env` file at the root of your project:

- `MONGODB_URL`: The connection URI for your MongoDB database.  
- `RESEND_API_KEY`: API key for the Resend service for email automation.  
- `NEXTAUTH_SECRET`: Secret key used by NextAuth for securing authentication sessions.  
- `OPENAI_API_KEY`: API key for accessing the OpenAI API for AI-suggested feedback.

Example `.env` file:

```plaintext
MONGODB_URL=mongodb+srv://username:password@cluster0.mongodb.net/dbname
RESEND_API_KEY=your_resend_api_key
NEXTAUTH_SECRET=your_nextauth_secret
OPENAI_API_KEY=your_openai_api_key
```

## Usage:
1. Ensure MongoDB is running.
2. Start the server using the provided start script.


## Contributing:
Contributions are welcome! Feel free to open issues or submit pull requests to help improve this project.

## Feedback and Contact:
I welcome any feedback or suggestions for improving this project. If you have questions, ideas, or just want to connect, feel free to reach out to me via email at [mananatal25@gmail.com](mailto:mananatal25@gmail.com) or through my [GitHub profile](https://github.com/mananatal).

Thank you for your interest in IncogInput!

