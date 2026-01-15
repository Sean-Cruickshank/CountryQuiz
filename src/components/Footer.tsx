interface FooterProps {
  theme: string,
}

export default function Footer({ theme }: FooterProps) {
  return (
    <footer className={`footer ${theme}`}>
      <i>
        WEBSITE CREATED BY
        <a
          className="footer__link"
          target="_blank"
          href="https://www.seancruickshank.co.nz">
          &nbsp;SEAN CRUICKSHANK&nbsp;
        </a>
        © 2026
      </i>
    </footer>
  )
}