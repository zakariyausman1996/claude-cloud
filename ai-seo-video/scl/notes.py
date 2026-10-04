DAYS=[("Day 1/3","AI search is just search.",[
("Same bot everywhere.","AI Overviews and AI Mode use Googlebot and classic Search. Gemini is not Search and may use a different crawler.","bots",0),
("Google doesn’t try to detect AI content.","But ranking models are trained on human content and favour natural, human-edited writing.","detect",0),
("1 in 6 queries is multimodal.","Gen Z searches with images and expects text answers.","multi",0),
("Skip LLMs.txt (and Cats.txt)","Google Search doesn’t use it.","bin",1),
("Skip Markdown copies of pages for bots","Duplicate content, and a cloaking risk if implemented wrong.","copy",1),
("Stop chasing crawl frequency","Crawling more doesn’t make you rank better.","wheel",1),
("A spammy past slows your crawl.","Historically spammy sites get deprioritised in the crawl scheduler.","snail",0),
("Two crawls, two goals.","Gemini training crawls for token volume over quality. Search crawls for quality and freshness.","two",0)]),
("Day 2/3","Raw HTML or it didn’t happen.",[
("Google finds your centerpiece.","HTML is parsed into a DOM tree, then the main content is separated from header, sidebar and footer.","dom",0),
("Want to be cited? Put it in the raw HTML.","Or render it server-side. Many AI crawlers don’t render JavaScript at all.","html",0),
("“Chunk your content for AI” is a myth.","Gemini’s context window is around a million tokens. Tiny chunks aren’t needed.","chunk",0),
("Schema is still worth it.","But it is not fed directly into AI context, and extra markup isn’t penalised.","schema",0),
("Alt text and nearby text rank images.","Descriptive alt text and the surrounding text are both used for ranking images.","alt",0),
("No watch page, no video indexing.","Each video needs its own page with the video above the fold. Use VideoObject markup and video sitemaps.","video",0),
("AI-generated images are fine.","Check them for errors like garbled text first.","aiimg",0),
("Content sets the language, not hreflang.","Google ignores hreflang and URL language codes here, and assigns one language per page.","lang",0),
("Machine translation isn’t a bad signal.","It’s a business decision, and not a bad quality signal if done right.","translate",0),
("SpamBrain catches 5x more spam.","Manual actions likely train it, which may explain slow recovery after a lifted penalty.","spam",0)]),
("Day 3/3","Commodity content loses.",[
("Every query gets silently rewritten.","The synonym system is one of the most important parts of ranking. Typos and plurals get fixed too.","rewrite",0),
("Fan-out is just more searches.","AI Overviews and AI Mode have an LLM generate extra queries. Each runs through normal Search.","fanout",0),
("Low quality? Not even retrieved.","Higher-quality URLs are more likely to be retrieved at all, and quality is reused in ranking.","net",0),
("Quality is one signal among hundreds.","Though, one of the most important.","sliders",0),
("Quality = effort, originality, skill, accuracy.","How much of each a human put into the content. The Search Quality Rater Guidelines help.","check4",0),
("Top-10 lists lose.","Commodity content anyone could write is the opposite of quality.","top10",0),
("Rater guidelines aren’t ranking factors.","Raters evaluate proposed changes: ~800,000 quality tests in 2023, ~5,000 launches a year.","ab",0),
("PageRank is barely used any more.","And the spam system is separate from quality ranking.","pr",0),
("Judge quality, not AI vs human.","The target: LLM-written “top 10” reviews of products the author never used.","scale",0),
("AI Overviews ignore structured data.","AI Overviews and AI Mode work from normal indexed text, today.","text",0)])]
def spoken(s):
    return (s.replace("LLMs.txt","L L M S dot text").replace("Cats.txt","cats dot text").replace("~800,000","about 800,000").replace("~5,000","about 5,000")
             .replace("5x","five times").replace("1 in 6","One in six").replace("=",", meaning").replace("“","").replace("”",""))
