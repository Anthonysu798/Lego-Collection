# Lego Collection Website

Welcome to the official repository for the Lego Collection Website. This site provides a dynamic platform for Lego enthusiasts to browse, add, and manage their Lego set collections. Our aim is to create a user-friendly interface that is responsive across a variety of devices and screen sizes.

## Features

### Responsive Web Design
- **Mobile**: Optimized for handheld devices, ensuring easy navigation and accessibility.
- **Tablet**: Intermediate sizing and layout adjustments provide a smooth transition between mobile and desktop views.
- **Desktop**: Full-feature display with expanded navigation and detailed content viewing options.

### Frameworks and Technologies

- **Tailwind CSS**: Utilized for styling and enabling responsive design. Tailwind CSS's utility-first approach helps in building custom designs with efficiency and speed.
- **DaisyUI**: Integrated with Tailwind CSS, DaisyUI provides prebuilt components such as cards, navigation bars, and forms, which enhance the UI/UX without sacrificing performance.

### User Interface Components

- **Cards**: Display individual Lego sets with details in a concise and visually appealing manner.
- **Navigation Bar**: Fully responsive with links to various sections of the website. Enhanced for better usability across devices.
- **Forms**: Used for adding and editing set entries. Designed to be intuitive and easy to use.

## Form Validation

The website ensures robust form validation to maintain data quality and enhance user experience:

- **Dynamic Feedback**: Immediate feedback is provided for each field, guiding users through a correct submission process.
- **Field Validations**:
  - **Year**: Numeric entries only, capped at the current year to maintain historical accuracy.
  - **Mandatory Fields**: All fields require valid entries before submission, ensuring complete and accurate data for every set.

### Hosting

- **AWS EC2**: The website is hosted on AWS EC2, providing a scalable and reliable cloud hosting solution. The instance was configured to allow HTTP and HTTPS traffic, ensuring secure communication.
- **SSL Certificate**: SSL certificates from Let's Encrypt were used to secure the website, leveraging Caddy for automatic HTTPS management.
- **Website Link**: [Visit the Lego Collection Website](https://www.legocollection.xyz/)

### Setup and Deployment Process

1. **Launch EC2 Instance**
    - **Platform**: AWS Management Console.
    - **AMI**: Ubuntu 24.04 LTS.
    - **Instance Type**: t2.micro (suitable for free tier).
    - **Security Groups**: Configured to allow HTTP (port 80) and HTTPS (port 443) traffic.
    - **Key Pair**: Created/selected a key pair for secure SSH access.

2. **Deploy the Web Application**
    - **Connection**: Established a secure connection to the EC2 instance using SSH.
    - **Node.js Installation**: Installed Node.js to run the application.
    - **Application Deployment**: Cloned the repository and set up the application.

3. **Set Up Caddy for HTTPS**
    - **Installation**: Installed Caddy, a powerful and easy-to-use web server.
    - **Configuration**: Created a `Caddyfile` to enable automatic HTTPS and reverse proxy functionality.
    - **Automatic HTTPS**: Leveraged Caddy's built-in support for Let's Encrypt to obtain and manage SSL certificates, ensuring secure HTTPS connections.

4. **DNS Configuration**
    - **Route 53**: Configured DNS records to point the custom domain to the EC2 instance.
    - **CNAME Records**: Added necessary CNAME records for domain validation and SSL certificate issuance.

## Recent Updates

- **Responsive Navbar**: The navigation bar has been updated to be fully responsive, providing a consistent experience on all devices.
- **CRUD Operations**: Users can now add, edit, and delete Lego sets from the collection. These features are implemented with user-friendly interfaces to ensure ease of use.

## Future Enhancements

- **User Authentication**: Plan to implement user login functionality for personalized experiences and secure collection management.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

