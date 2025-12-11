import { useNavigate } from "react-router-dom"

let navigate = useNavigate()

function scrollToTop() {
window.scrollTo({
    top: 0
});
}

export function viewPage(page: string) {
    navigate(`/${page}`)
    scrollToTop()
}