from langchain.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage

template="""You are a professional problem solver.
Human: Tell me a {adjective} stroy about a {animal}.
Assistant:"""

prompt_multi=ChatPromptTemplate.from_template(template)
prompt=prompt_multi.invoke({"adjective":"funny","animal":"dog"})
print(prompt)