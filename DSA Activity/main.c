
#include <stdio.h>
#include <ctype.h>
#include <string.h>

#define MAX 100

char stack[MAX];
int top = -1;

void push(char value)
{
    if (top < MAX - 1)
        stack[++top] = value;
}

char pop()
{
    if (top >= 0)
        return stack[top--];

    return '\0';
}

char peek()
{
    if (top >= 0)
        return stack[top];

    return '\0';
}

int precedence(char op)
{
    switch (op)
    {
        case '+':
        case '-':
            return 1;

        case '*':
        case '/':
            return 2;

        case '^':
            return 3;

        default:
            return 0;
    }
}

int isOperator(char ch)
{
    return ch == '+' || ch == '-' ||
           ch == '*' || ch == '/' || ch == '^';
}

void displayStack()
{
    int i;

    if (top == -1)
    {
        printf("Empty");
        return;
    }

    for (i = 0; i <= top; i++)
        printf("%c", stack[i]);
}

void infixToPostfix(char infix[])
{
    char postfix[MAX];
    int i, j = 0;
    char ch;

    top = -1;

    printf("\n%-8s %-12s %-18s %s\n",
           "Step", "Symbol", "Stack", "Output");

    printf("--------------------------------------------------\n");

    for (i = 0; infix[i] != '\0'; i++)
    {
        ch = infix[i];

        if (isspace((unsigned char)ch))
            continue;

        if (isalnum((unsigned char)ch))
        {
            postfix[j++] = ch;
        }
        else if (ch == '(')
        {
            push(ch);
        }
        else if (ch == ')')
        {
            while (top != -1 && peek() != '(')
                postfix[j++] = pop();

            if (top != -1 && peek() == '(')
                pop();
            else
            {
                printf("\nError: Mismatched parentheses.\n");
                return;
            }
        }
        else if (isOperator(ch))
        {
            while (top != -1 && isOperator(peek()) &&
                  (precedence(peek()) > precedence(ch) ||
                  (precedence(peek()) == precedence(ch)
                   && ch != '^')))
            {
                postfix[j++] = pop();
            }

            push(ch);
        }
        else
        {
            printf("\nError: Invalid character '%c'.\n", ch);
            return;
        }

        printf("%-8d %-12c ", i + 1, ch);

        displayStack();

        postfix[j] = '\0';

        printf("%*s%s\n",
               18 - (top + 1 > 0 ? top + 1 : 5),
               "", postfix);
    }

    while (top != -1)
    {
        if (peek() == '(')
        {
            printf("\nError: Mismatched parentheses.\n");
            return;
        }

        postfix[j++] = pop();
    }

    postfix[j] = '\0';

    printf("\nInfix Expression   : %s", infix);
    printf("\nPostfix Expression : %s\n", postfix);
}

int main()
{
    char infix[MAX];

    printf("====================================\n");
    printf("   INFIX TO POSTFIX CONVERSION\n");
    printf("====================================\n");

    printf("Enter infix expression: ");

    if (fgets(infix, sizeof(infix), stdin) == NULL)
        return 1;

    infix[strcspn(infix, "\n")] = '\0';

    infixToPostfix(infix);

    return 0;
}
