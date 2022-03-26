export const UserRegisterHtml = (
    name: string,
    email: string,
    password: string,
): string => {
    return `

        <htm> 
          <body>
          <h1> Hey, ${name}Welcome to project </h1> 
                Your login credntials are : <br/> 
                Email : ${email} <br/> 
                password: ${password} <br/>
                
          </body> 
        </html>     
    `;
};
