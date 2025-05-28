import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendResetEmail(to: string, token: string) {
  
  const resetUrl = `${process.env.BASE_URL}/reset-password?token=${token}`;

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #7E6363;">Orchedule 비밀번호 재설정 안내</h2>
    <p>안녕하세요,</p>
    <p>요청하신 비밀번호 재설정을 위해 아래 버튼을 눌러주세요.</p>
    <a href="${resetUrl}" 
       style="display: inline-block; margin-top: 12px; padding: 10px 20px; background-color: #7E6363; color: #fff; text-decoration: none; border-radius: 6px;">
       비밀번호 재설정
    </a>
    <p style="margin-top: 20px;">만약 위 버튼이 작동하지 않는다면 아래 링크를 복사해서 브라우저에 붙여넣어주세요:</p>
    <p style="word-break: break-all;">${resetUrl}</p>
    <hr style="margin: 32px 0;" />
    <p style="font-size: 12px; color: #999;">이 메일은 orchedule 서비스에서 발송된 자동 메일입니다.</p>
  </div>
`;



  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: "[Orchedule] 비밀번호 재설정 안내",
    html: htmlContent,
  };

  await sgMail.send(msg);
}
