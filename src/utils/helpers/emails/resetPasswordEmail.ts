export const UserResetPasswordHtml = (digits: Number): string => {
    return `

        <htm> 
          <body>
          <h1> Recover your project Account </h1> 
                Your 6 digits are : <br/> 
                 ${digits}
                
          </body> 
        </html>     
    `;
};
