import cls from "./footer.module.scss";
import gitSvg from "./git.svg";
import emailSvg from "./email.svg";
import telegramSvg from "./telegram.svg";
import whatsappSvg from "./whatsapp.svg";

export const Footer = () => {
  return (
    <footer className={cls.footer}>
      <a
        href="https://github.com/1351618/mini_game_billiards"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={gitSvg} alt="gitSvg" />
        GitHub
      </a>
      <a href="tel:+79939231608">
        <img src={telegramSvg} alt="telegramSvg" />
        +79939231608
      </a>
      <a
        href="https://wa.me/79939231608"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={whatsappSvg} alt="whatsappSvg" />
        +79939231608
      </a>
      <a href="mailto:1351618@gmail.com">
        <img src={emailSvg} alt="emailSvg" />
        1351618@gmail.com
      </a>
    </footer>
  );
};
