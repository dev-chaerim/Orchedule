import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendResetEmail(to: string, token: string) {
  
  const resetUrl = `${process.env.BASE_URL}/reset-password?token=${token}`;


  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: "[Orchedule] 비밀번호 재설정 안내",
    html: `
      <p>비밀번호 재설정을 요청하셨습니다.</p>
      <p>아래 링크를 클릭하여 새 비밀번호를 설정하세요:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>이 링크는 1시간 동안 유효합니다.</p>
    `,
  };

  await sgMail.send(msg);
}
