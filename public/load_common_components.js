const topNavOptions = [
{
	href:"./index.html",
	title:'About'
},
{
	href: "./projects.html",
	title:'Projects'
},
{
	href: "./feedback.html",
	title:'Feedback'
}
]

function populateMenu(){
	let nav= document.querySelector('nav');
	for(opt of topNavOptions){
		let child = document.createElement("a");
		child.textContent = opt.title;
		child.setAttribute('href',opt.href);
		nav.appendChild(child); 
	}
}

populateMenu();